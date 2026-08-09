import { Button, Card, Form } from "react-bootstrap";
import { Book } from "../../API/models/Book";
import * as BookService from "../../API/services/BookService";
import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateBook, updateBookSchema } from "../../API/schemas/BookSchema";
import { Genre } from "../../API/models/Genre";
import GenreLabel from "../../components/GenreLabel";
import { Author } from "../../API/models/Author";
import { Publisher } from "../../API/models/Publisher";
import * as AuthorService from "../../API/services/AuthorService";
import * as PublisherService from "../../API/services/PublisherService";
import AuthorAddModal from "../../components/Author/AuthorAddModal";
import PublisherAddModal from "../../components/Publisher/PublisherAddModal";
import { ImageWithTitle } from "../../components/ImageWithTitle";
import { SearchBar } from "../../components/SearchBar";
import defaultAvatar from "../../placeholders/default-avatar.jpg"
import GenreAddModal from "../../components/Genre/GenreAddModal";
import * as GenreService from "../../API/services/GenreService";

export function BooksEditPage() {
  const {book_id} = useParams<{book_id: string}>();
  const navigate = useNavigate();

  // initial book state
  const [initialBook, setInitialBook] = useState<Book | null>(null);

  // update book state
  const [newTitle, setNewTitle] =  useState<Book["title"] | undefined>(undefined);
  
  // author
  const [newAuthor, setNewAuthor] =  useState<Author | null | undefined>(undefined);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);

  // publisher
  const [newPublisher, setNewPublisher] =  useState<Publisher | null | undefined>(undefined);
  const [showAddPublisherModal, setShowAddPublisherModal] = useState(false);

  // genre
  const [newGenre, setNewGenre] =  useState<(Genre | Book["genres"][number])[] | undefined>(undefined);
  const [showAddGenreModal, setShowAddGenreModal] = useState<boolean>(false);
  
  const [newPublicationYear, setNewPublicationYear] =  useState<Book["publication_year"] | undefined>(undefined);
  const [newSummary, setNewSummary] =  useState<Book["summary"] | undefined>(undefined);
  const [newLanguage, setNewLanguage] =  useState<Book["language"] | undefined>(undefined);
  const [newIsbn, setNewIsbn] =  useState<Book["isbn"] | undefined>(undefined);
  const [newEdition, setNewEdition] =  useState<Book["edition"] | undefined>(undefined);
  const [newCoverFile, setNewCoverFile] =  useState<File | undefined>(undefined);

  const [isBookLoaded, setIsBookLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = newTitle ?? initialBook?.title;
  const author = newAuthor ?? initialBook?.author;
  const publisher = newPublisher ?? initialBook?.publisher;
  const genres = newGenre ?? initialBook?.genres;
  const publicationYear = newPublicationYear ?? initialBook?.publication_year;
  const summary = newSummary ?? initialBook?.summary;
  const language = newLanguage ?? initialBook?.language;
  const isbn = newIsbn ?? initialBook?.isbn;
  const edition = newEdition ?? initialBook?.edition;
  const coverFile = (newCoverFile && URL.createObjectURL(newCoverFile)) ?? initialBook?.cover_img;

  async function loadBooks(book_id: string){
      try{
          setIsBookLoaded(false);

          const book = await BookService.getOneBook(book_id);

          setInitialBook(book);
      }
      catch(err){
          setError("Failed to load book data");
      }
      finally{
          setIsBookLoaded(true);
      }
  }

  async function onSubmit(event: SubmitEvent){
      event.preventDefault();

      if(!book_id){
          navigate("/books");
          return;
      }

      const updateBook: UpdateBook = {};

      if(newTitle !== undefined) updateBook.title = newTitle;
      if(newAuthor !== undefined) updateBook.author_id = newAuthor?.author_id;
      if(newPublisher !== undefined) updateBook.publisher_id = newPublisher?.publisher_id;
      if(newPublicationYear !== undefined) updateBook.publication_year = newPublicationYear;
      if(newSummary !== undefined) updateBook.summary = newSummary;
      if(newLanguage !== undefined) updateBook.language = newLanguage;
      if(newGenre !== undefined) updateBook.genre_ids = newGenre?.map((g) => g.genre_id);
      if(newIsbn !== undefined) updateBook.isbn = newIsbn;
      if(newEdition !== undefined) updateBook.edition = newEdition;

      const parsed = updateBookSchema.parse(updateBook);

      try{
          setError(null);
          setIsSubmitting(true);
          const book = await BookService.editBook(book_id, parsed, newCoverFile);

          navigate("/books");
      }
      catch(err){
          setError("Failed to edit book");
      }
      finally{
          setIsSubmitting(false);
      }
  }

  const genreListUI = (newGenre ?? initialBook?.genres)?.map((g) => (
    <GenreLabel 
      genre={g}
      onClick={(genre) => setNewGenre((genres ?? []).filter(g => g.genre_id !== genre.genre_id))}
    >
      <span 
        className="ms-2"
        style={{ cursor: "pointer" }}
      >
        &times;
      </span>
    </GenreLabel>
  ));

  useEffect(() => {
      if(!book_id){
          navigate("/books");
          return;
      }

      loadBooks(book_id);
  }, [])

  if(!isBookLoaded){
      return <p>Loading book data...</p>;
  }

  return (
    <Card className="shadow-sm">
      <AuthorAddModal 
        show={showAddAuthorModal}
        onAuthorAdded={setNewAuthor}
        onClose={() => setShowAddAuthorModal(false)}
      />

      <PublisherAddModal 
        onPublisherAdded={setNewPublisher}
        onClose={() => setShowAddPublisherModal(false)}
        show={showAddPublisherModal}
      />

      <GenreAddModal 
        onGenreAdded={(genre) => setNewGenre([...(newGenre ?? []), genre])}
        onClose={() => setShowAddGenreModal(false)}
        show={showAddGenreModal}
      />

      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={title}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            {
              (author) && (
                <ImageWithTitle 
                  src={author.author_img ?? defaultAvatar}
                  title={author.author_name}
                />
              )
            }

            <SearchBar 
              search={AuthorService.searchAuthors}
              placeholder="Search Author"
              onElementClick={setNewAuthor}
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

            <SearchBar 
              search={PublisherService.getPublishers}
              placeholder="Search Publisher"
              onElementClick={setNewPublisher}
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
              value={publicationYear}
              onChange={(e) => setNewPublicationYear(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="summary"
              value={summary}
              onChange={(e) => setNewSummary(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Control
              type="text"
              name="language"
              value={language}
              onChange={(e) => setNewLanguage(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>

            <div className="mb-2 d-flex flex-wrap gap-1">
              {genreListUI}
            </div>

            <SearchBar<Genre>
              search={(keyword) => GenreService.getGenres({keyword, exclude_genre_ids: (genres ?? []).map(g => g.genre_id)})}
              placeholder="Search Genre"
              onElementClick={(g) => {setNewGenre([...(genres ?? []), g])}}
              element={(genre) => (<ImageWithTitle src={genre.genre_img ?? defaultAvatar} title={genre.genre_name} />)}
            >
              <Button
                onClick={() => setShowAddGenreModal(true)}
              >
                Add New Genre
              </Button>
            </SearchBar>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edition</Form.Label>
            <Form.Control
              type="text"
              name="edition"
              value={edition ?? ""}
              onChange={(e) => setNewEdition(e.target.value || null)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={isbn ?? ""}
              onChange={(e) => setNewIsbn(e.target.value || null)}
            />
          </Form.Group>

          {/* Cover Image */}
          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            {coverFile && (
              <div className="mb-2">
                <img
                  src={coverFile}
                  alt="Existing cover"
                  style={{
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setNewCoverFile(e.target.files[0]);
                } else {
                  setNewCoverFile(undefined);
                }
                }}
            />

            <Form.Text className="text-muted">
              Leave empty to keep existing cover
            </Form.Text>
          </Form.Group>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Form>

        {error && (
            <p className="text-danger mt-3">{error}</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default BooksEditPage;