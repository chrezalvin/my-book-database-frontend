import { Badge, Button, Form } from "react-bootstrap";
import { BookUpdate, updateBookSchema } from "../../../API/schemas/BookSchema";
import { SubmitEvent, useEffect, useState } from "react";
import z, { treeifyError } from "zod";
import AuthorAddModal from "../../Author/Modals/AuthorAddModal";
import PublisherAddModal from "../../Publisher/Modals/PublisherAddModal";
import GenreAddModal from "../../Genre/Modals/GenreAddModal";
import { ImageWithTitle } from "../../ImageWithTitle";
import defaultAvatar from "../../../placeholders/default-avatar.jpg";
import { SearchBar } from "../../SearchBar";
import * as AuthorService from "../../../API/services/AuthorService";
import * as PublisherService from "../../../API/services/PublisherService";
import * as GenreService from "../../../API/services/GenreService";
import ArrayInputGeneric from "../../ArrayInputGeneric";
import { Book } from "../../../API/models/Book";
import { Author } from "../../../API/models/Author";
import { Publisher } from "../../../API/models/Publisher";

export interface BookUpdateFormProps{
  onUpdate: (book: Book, bookUpdate: BookUpdate) => void

  initialBook: Book;
  disabled?: boolean;

  id?: string;
}

export function BookUpdateForm(props: BookUpdateFormProps){
  const [bookUpdate, setBookUpdate] = useState<BookUpdate>({});
  const [error, setError] = useState<ReturnType<typeof treeifyError<BookUpdate>>>()

  const currentBookUpdate: BookUpdate = {
    book: {
        ...props.initialBook,
        ...bookUpdate.book
    },
    image: bookUpdate.image
  }

  const bookImageUrl: Book["cover_img"] = currentBookUpdate.image ? URL.createObjectURL(currentBookUpdate.image) : props.initialBook.cover_img;

  const [showAddAuthorModal, setShowAddAuthorModal] = useState<boolean>(false);
  const [author, setAuthor] = useState<Book["author"] | undefined>(props.initialBook.author);
  
  const [showAddGenreModal, setShowAddGenreModal] = useState<boolean>(false);
  const [genres, setGenres] = useState<Book["genres"] | undefined>(props.initialBook.genres);
  
  const [showAddPublisherModal, setShowAddPublisherModal] = useState<boolean>(false);
  const [publisher, setPublisher] = useState<Book["publisher"] | undefined>(props.initialBook.publisher);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = updateBookSchema.safeParse(bookUpdate);

    if(error)
      setError(z.treeifyError(error)); 
    
    if(data)
      props.onUpdate(props.initialBook, data);
  }

  function handleBookChange<_T extends keyof NonNullable<BookUpdate["book"]>>(key: _T, value: NonNullable<BookUpdate["book"]>[_T]){
    const newObj: BookUpdate = {...bookUpdate, book: {...bookUpdate.book, [key]: value}};

    setBookUpdate(newObj);
  }

  useEffect(() => {
    handleBookChange("author_id", author?.author_id);      
  }, [author]);

  useEffect(() => {
    handleBookChange("publisher_id", publisher?.publisher_id);
  }, [publisher])

  useEffect(() => {
    setBookUpdate({...bookUpdate, genre_ids: genres?.map(g => g.genre_id)});
  }, [genres])

  // for startup to load author/publisher/genre
  useEffect(() => {
    const book = props.initialBook;

    if(book.author?.author_id)
      AuthorService
        .getAuthorById(book.author.author_id)
        .then(setAuthor)
        .catch((_) => setAuthor(null));

    if(book.publisher?.publisher_id)
      PublisherService
        .getPublisherById(book.publisher.publisher_id)
        .then(setPublisher)
        .catch((_) => setPublisher(null));
  }, [])

  return (
    <Form 
      onSubmit={handleSubmit} 
      onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault(); }}
      id={props.id}
    >
      <AuthorAddModal 
        onAuthorAdded={setAuthor}
        onClose={() => setShowAddAuthorModal(false)}
        show={showAddAuthorModal}
      />

      <PublisherAddModal 
        onPublisherAdded={setPublisher}
        onClose={() => setShowAddPublisherModal(false)}
        show={showAddPublisherModal}
      />

      <GenreAddModal 
        onGenreAdded={(newGenre) => setGenres([...(genres ?? []), newGenre])}
        onClose={() => setShowAddGenreModal(false)}
        show={showAddGenreModal}
      />

      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          name="title"
          value={currentBookUpdate.book?.title}
          onChange={(e) => handleBookChange("title", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>

        {
          author && (
            <ImageWithTitle 
              src={author.author_img ?? defaultAvatar}
              title={author.author_name}
            />
          )
        }

        <SearchBar<Author>
          search={(name) => AuthorService.searchAuthors({name})}
          placeholder="Search Author"
          onElementClick={setAuthor}
          element={(author) => (<ImageWithTitle src={author.author_img ?? defaultAvatar} title={author.author_name} />)}
        >
          <Button
            onClick={() => setShowAddAuthorModal(true)}
          >Add New Author</Button>
        </SearchBar>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Publisher</Form.Label>

        {
          publisher && (
            <ImageWithTitle 
              src={publisher.publisher_img ?? defaultAvatar}
              title={publisher.publisher_name}
            />
          )
        }

        <SearchBar<Publisher>
          search={(name) => PublisherService.getPublishers({name})}
          placeholder="Search Publisher"
          onElementClick={setPublisher}
          element={(publisher) => (<ImageWithTitle src={publisher.publisher_img ?? defaultAvatar} title={publisher.publisher_name} />)}
        >
          <Button
            onClick={() => setShowAddPublisherModal(true)}
          >Add New Publisher</Button>
        </SearchBar>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Publication Year</Form.Label>
        <Form.Control
          type="number"
          name="publication_year"
          disabled={props.disabled}
          value={currentBookUpdate.book?.publication_year}
          onChange={(e) => handleBookChange("publication_year", e.target.value.length > 0 ? parseInt(e.target.value) : 0)}
        />
      </Form.Group>

      <ArrayInputGeneric<Book["genres"][number]>
        arrToJSX={(genreList, triggerRemove) => (
          <div className="mb-2 d-flex flex-wrap gap-1">
            {genreList?.map(g => (
              <Badge 
                key={g.genre_id}
                bg="secondary"
                className="d-inline-flex align-items-center py-2"
                onClick={() => triggerRemove(g)}
              >
                {g.genre_name}
              </Badge>
            ))}
          </div>
        )}
        getEleJSX={(triggerAdd) => (
          <SearchBar<Book["genres"][number]>
            search={(keyword) => GenreService.getGenres({keyword, exclude_genre_ids: genres?.map(g => g.genre_id)})}
            placeholder="Search Genre"
            onElementClick={triggerAdd}
            element={(genre) => (<ImageWithTitle src={genre.genre_img ?? defaultAvatar} title={genre.genre_name} />)}
          >
            <Button
              onClick={() => setShowAddGenreModal(true)}
            >
              Add New Genre
            </Button>
          </SearchBar>
        )}
        pred={(a, b) => a.genre_id === b.genre_id}
        elements={genres ?? []}
        onArrayChange={setGenres}
        title="Genre"
      />

      <Form.Group className="mb-3">
        <Form.Label>Language</Form.Label>
        <Form.Control
          type="text"
          name="language"
          value={currentBookUpdate.book?.language}
          disabled={props.disabled}
          onChange={(e) => handleBookChange("language", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Edition</Form.Label>
        <Form.Control
          type="text"
          name="edition"
          disabled={props.disabled}
          value={currentBookUpdate.book?.edition ?? undefined}
          onChange={(e) => handleBookChange("edition", e.target.value.length == 0 ? null: e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>ISBN</Form.Label>
        <Form.Control
          type="text"
          name="isbn"
          disabled={props.disabled}
          value={currentBookUpdate.book?.isbn ?? undefined}
          onChange={(e) => handleBookChange("isbn", e.target.value.length == 0 ? null: e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Summary</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="summary"
          disabled={props.disabled}
          value={currentBookUpdate.book?.summary}
          onChange={(e) => handleBookChange("summary", e.target.value)}
        />
      </Form.Group>

      {/* Cover Image */}
      <Form.Group className="mb-3">
        <Form.Label>Cover Image</Form.Label>

        <Form.Control
          type="file"
          accept="image/*"
          disabled={props.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setBookUpdate({...bookUpdate, image: e.target.files?.[0]})
          }}
        />
      </Form.Group>
    </Form>
  );
}

export default BookUpdateForm;