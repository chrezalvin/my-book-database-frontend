import { Button, Card, Form } from "react-bootstrap";
import * as BookService from "../../API/services/BookService";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreateBook, createBookSchema } from "../../API/schemas/BookSchema";
import { Genre } from "../../API/models/Genre";
import GenreLabel from "../../components/GenreLabel";
import * as GenreService from "../../API/services/GenreService";
import { ZodError } from "zod";
import { Author } from "../../API/models/Author";
import { Publisher } from "../../API/models/Publisher";
import * as AuthorService from "../../API/services/AuthorService";
import * as PublisherService from "../../API/services/PublisherService";
import AuthorAddModal from "../../components/Author/AuthorAddModal";
import PublisherAddModal from "../../components/Publisher/PublisherAddModal";
import { ImageWithTitle } from "../../components/ImageWithTitle";
import defaultAvatar from "../../placeholders/default-avatar.jpg";
import { SearchBar } from "../../components/SearchBar";
import GenreAddModal from "../../components/Genre/GenreAddModal";

export function BooksCreatePage() {
    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const author_id = searchParams.get("author_id") ?? undefined;
    const publisher_id = searchParams.get("publisher_id") ?? undefined;

    const [title, setTitle] =  useState("");

    // author
    const [author, setAuthor] =  useState<Author | null>(null);
    const [showAddAuthorModal, setShowAddAuthorModal] = useState<boolean>(false);
    
    // publisher
    const [publisher, setPublisher] =  useState<Publisher | null>(null);
    const [showAddPublisherModal, setShowAddPublisherModal] = useState<boolean>(false);
    
    // genre
    const [genreList, setGenreList] =  useState<Genre[]>([]);
    const [showAddGenreModal, setShowAddGenreModal] = useState<boolean>(false);

    const [publicationYear, setPublicationYear] =  useState<number | null>(null);
    const [summary, setSummary] =  useState("");
    const [coverFile, setCoverFile] =  useState<File | null>(null);
    const [language, setLanguage] =  useState("en");
    const [edition, setEdition] =  useState<string | null>(null);
    const [isbn, setIsbn] =  useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormValidated, setIsFormValidated] = useState(false);

    const [errorMap, setErrorMap] = useState<Record<string, string>>({});

    async function submitBook(){
      try{
        setIsFormValidated(true);
        setIsSubmitting(true);

        if(publicationYear == null)
          throw new Error("Publication year is required.");

        const createBook: CreateBook = {
          title: title,
          author_id: author?.author_id ?? null,
          publisher_id: publisher?.publisher_id ?? null,
          summary: summary,
          genre_ids: genreList.map((g) => g.genre_id),
          language: language,
          edition: edition,
          isbn: isbn,
          publication_year: publicationYear,
        }

        const parsed = createBookSchema.parse(createBook);

        const newBook = await BookService.addNewBook(parsed, coverFile ?? undefined);

        // go to appropriate page after submitting
        if(publisher_id)
          navigate(`/publishers/${publisher_id}`);
        else if(author_id)
          navigate(`/authors/${author_id}`);
        else
          navigate(`/books`);
      }
      catch(err){
        setError("Failed to create book, please check your input and try again.");

        if(err instanceof ZodError){
          const zodError = err;

          const fieldErrors: Record<string, string> = {};
          for (const issue of zodError.issues) {
            if (issue.path.length > 0) {
              const fieldName = issue.path[0].toString();
              fieldErrors[fieldName] = issue.message;
            }
          }

          setErrorMap(fieldErrors);
        }

        console.error(err);
      }
      finally{
        setIsSubmitting(false);
      }
    }

    async function handleInitialAuthorAndPublisher(){
      try{
        if(author_id){
          const author = await AuthorService.getAuthorById(author_id);
          setAuthor(author);
        }

        if(publisher_id){
          const publisher = await PublisherService.getPublisherById(publisher_id);
          setPublisher(publisher);
        }
      }
      catch(err){
        console.error("Error fetching initial author or publisher:", err);
      }
    }

    useEffect(() => {
      handleInitialAuthorAndPublisher();
    }, []);

    const genreListUI = genreList.map((g) => (
      <GenreLabel 
        key={g.genre_id} 
        genre={g}
        onClick={(genreToDelete) => {
          setGenreList(genreList.filter((g) => g.genre_id !== genreToDelete.genre_id));
        }}
      />
    ))

    return (
    <Card className="shadow-sm">
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
        onGenreAdded={(newGenre) => setGenreList([...genreList, newGenre])}
        onClose={() => setShowAddGenreModal(false)}
        show={showAddGenreModal}
      />

      <Card.Body>
        <Form 
          noValidate  
          onSubmit={(e) => {
            e.preventDefault();
            submitBook();
          }}
        >
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={isFormValidated && !!errorMap["title"]}
            />
            <Form.Control.Feedback className="text-danger" type="invalid">
              {errorMap["title"]}
            </Form.Control.Feedback>
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

            <SearchBar 
              search={AuthorService.searchAuthors}
              placeholder="Search Author"
              onElementClick={setAuthor}
              element={(author) => (<ImageWithTitle src={author.author_img ?? defaultAvatar} title={author.author_name} />)}
            >
              <Button
                onClick={() => setShowAddAuthorModal(true)}
              >Add New Author</Button>
            </SearchBar>

            <Form.Control.Feedback className="text-danger" type="invalid">
              {errorMap["author"]}
            </Form.Control.Feedback>
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
              onElementClick={setPublisher}
              element={(publisher) => (<ImageWithTitle src={publisher.publisher_img ?? defaultAvatar} title={publisher.publisher_name} />)}
            >
              <Button
                onClick={() => setShowAddPublisherModal(true)}
              >Add New Publisher</Button>
            </SearchBar>

            <Form.Control.Feedback className="text-danger" type="invalid">
              {errorMap["publisher"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publication Year</Form.Label>
            <Form.Control
              type="number"
              name="publication_year"
              value={publicationYear ?? ""}
              onChange={(e) => setPublicationYear(e.target.value.length > 0 ? parseInt(e.target.value) : null)}
              isInvalid={isFormValidated && !!errorMap["publication_year"]}
            />
            <Form.Control.Feedback className="text-danger" type="invalid">
              {errorMap["publication_year"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>

            <div className="mb-2 d-flex flex-wrap gap-1">
              {genreListUI}
            </div>

            <SearchBar<Genre>
              search={(keyword) => GenreService.getGenres({keyword, exclude_genre_ids: genreList.map(g => g.genre_id)})}
              placeholder="Search Genre"
              onElementClick={(g) => {setGenreList([...genreList, g])}}
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
            <Form.Label>Language</Form.Label>
            <Form.Control
              type="text"
              name="language"
              value="en"
              onChange={(e) => setLanguage(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edition</Form.Label>
            <Form.Control
              type="text"
              name="edition"
              value={edition ?? undefined}
              onChange={(e) => setEdition(e.target.value.length == 0 ? null: e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={isbn ?? undefined}
              onChange={(e) => setIsbn(e.target.value.length == 0 ? null: e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </Form.Group>

          {/* Cover Image */}
          <Form.Group className="mb-3">
            <Form.Label>Cover Image</Form.Label>

            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setCoverFile(e.target.files[0]);
                } else {
                  setCoverFile(null);
                }
                }}
            />
          </Form.Group>

          {error && (
              <p className="text-danger mt-3">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            onClick={submitBook}
          >
            Create Book
          </Button>
        </Form>
      </Card.Body>
    </Card>
    )
}

export default BooksCreatePage;