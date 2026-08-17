import { Badge, Button, Form } from "react-bootstrap";
import { BookCreate, createBookSchema } from "../../../API/schemas/BookSchema";
import { SubmitEvent, useEffect, useState } from "react";
import z, { treeifyError } from "zod";
import AuthorAddModal from "../../Author/Modals/AuthorAddModal";
import PublisherAddModal from "../../Publisher/Modals/PublisherAddModal";
import GenreAddModal from "../../Genre/Modals/GenreAddModal";
import { Author } from "../../../API/models/Author";
import { Publisher } from "../../../API/models/Publisher";
import { Genre } from "../../../API/models/Genre";
import { ImageWithTitle } from "../../ImageWithTitle";
import defaultAvatar from "../../../placeholders/default-avatar.jpg";
import { SearchBar } from "../../SearchBar";
import * as AuthorService from "../../../API/services/AuthorService";
import * as PublisherService from "../../../API/services/PublisherService";
import * as GenreService from "../../../API/services/GenreService";
import ArrayInputGeneric from "../../ArrayInputGeneric";

export interface BookCreateFormProps{
  onCreate: (bookCreate: BookCreate) => void

  initialBook: BookCreate;
  disabled?: boolean;

  id?: string;
}

export function BookCreateForm(props: BookCreateFormProps){
  const [bookCreate, setBookCreate] = useState<BookCreate>(props.initialBook);
  const [error, setError] = useState<ReturnType<typeof treeifyError<BookCreate>>>()

  const [showAddAuthorModal, setShowAddAuthorModal] = useState<boolean>(false);
  const [author, setAuthor] = useState<Author | null>(null);
  
  const [showAddGenreModal, setShowAddGenreModal] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[] | null>(null);
  
  const [showAddPublisherModal, setShowAddPublisherModal] = useState<boolean>(false);
  const [publisher, setPublisher] = useState<Publisher | null>(null);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();
    e.stopPropagation();

    const {error, data} = createBookSchema.safeParse(bookCreate);

    if(error)
      setError(z.treeifyError(error)); 
    
    if(data)
      props.onCreate(data);
  }

  function handleBookChange<_T extends keyof BookCreate["book"]>(key: _T, value: BookCreate["book"][_T]){
    const newObj: BookCreate = {...bookCreate, book: {...bookCreate.book, [key]: value}};

    setBookCreate(newObj);
  }

  useEffect(() => {
    handleBookChange("author_id", author?.author_id ?? null);      
  }, [author]);

  useEffect(() => {
    handleBookChange("publisher_id", publisher?.publisher_id ?? null);
  }, [publisher])

  useEffect(() => {
    setBookCreate({...bookCreate, genre_ids: genres?.map(g => g.genre_id)});
  }, [genres])

  // for startup to load author/publisher/genre
  useEffect(() => {
    const book = props.initialBook.book;

    if(book.author_id)
      AuthorService
        .getAuthorById(book.author_id)
        .then(setAuthor)
        .catch((_) => setAuthor(null));

    if(book.publisher_id)
      PublisherService
        .getPublisherById(book.publisher_id)
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
          value={bookCreate.book.title}
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
          search={(keyword) => AuthorService.searchAuthors({name: keyword})}
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
          search={(keyword) => PublisherService.getPublishers({name: keyword})}
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
          value={bookCreate.book.publication_year ?? ""}
          onChange={(e) => handleBookChange("publication_year", e.target.value.length > 0 ? parseInt(e.target.value) : 0)}
        />
      </Form.Group>

      <ArrayInputGeneric<Genre>
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
          <SearchBar<Genre>
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
          value="en"
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
          value={bookCreate.book.edition ?? undefined}
          onChange={(e) => handleBookChange("edition", e.target.value.length === 0 ? null: e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>ISBN</Form.Label>
        <Form.Control
          type="text"
          name="isbn"
          disabled={props.disabled}
          value={bookCreate.book.isbn ?? undefined}
          onChange={(e) => handleBookChange("isbn", e.target.value.length === 0 ? null: e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Summary</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="summary"
          disabled={props.disabled}
          value={bookCreate.book.summary}
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
            setBookCreate({...bookCreate, image: e.target.files?.[0]})
          }}
        />
      </Form.Group>
    </Form>
  );
}

export default BookCreateForm;