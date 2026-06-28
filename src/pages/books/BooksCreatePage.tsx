import { Button, Card, Form } from "react-bootstrap";
import { BookService } from "../../API/services/BookService";
import { SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBookSchema, updateBookSchema } from "../../API/schemas/BookSchema";
import { Genre } from "../../API/models/Genre";
import GenreLabel from "../../components/GenreLabel";
import GenreSearch from "../../components/GenreSearch";
import { GenreService } from "../../API/services/GenreService";
import { ZodError } from "zod";

function BooksCreatePage() {
    const navigate = useNavigate();

    const [title, setTitle] =  useState("");
    const [author, setAuthor] =  useState("");
    const [publisher, setPublisher] =  useState("");
    const [publicationYear, setPublicationYear] =  useState<number | null>(null);
    const [summary, setSummary] =  useState("");
    const [coverFile, setCoverFile] =  useState<File | null>(null);
    const [genreList, setGenreList] =  useState<Genre[]>([]);
    const [language, setLanguage] =  useState("en");
    const [edition, setEdition] =  useState<string | null>(null);
    const [isbn, setIsbn] =  useState<string | null>(null);

    const [isAddingGenre, setIsAddingGenre] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormValidated, setIsFormValidated] = useState(false);

    const [errorMap, setErrorMap] = useState<Record<string, string>>({});

    async function submitBook(){
      try{
        setIsFormValidated(true);
        setIsSubmitting(true);

        const parsed = createBookSchema.parse({
          title,
          author,
          publisher,
          publication_year: publicationYear,
          summary,
          genre_ids: genreList.map((g) => g.genre_id),
          language,
          edition,
          isbn,
        })

        const newBook = await BookService.addNewBook(parsed, coverFile ?? undefined);

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

    const genreListUI = genreList.map((g) => (
      <GenreLabel 
        key={g.genre_id} 
        genre={g} 
        onDelete={(genre) => {
          setGenreList(genreList.filter((g) => g.genre_id !== genre.genre_id));
        }}
      />
    ))

    return (
    <Card className="shadow-sm">
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
            <Form.Control
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              isInvalid={isFormValidated && !!errorMap["author"]}
            />
            <Form.Control.Feedback className="text-danger" type="invalid">
              {errorMap["author"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              name="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              isInvalid={isFormValidated && !!errorMap["publisher"]}
            />
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
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setIsAddingGenre(!isAddingGenre)}
              >
                +
              </Button>
            </div>

            <GenreSearch 
              show={isAddingGenre}
              currentGenres={genreList}
              onGenreSelect={(g) => {
                setGenreList([...genreList, g]);
                setIsAddingGenre(false);
              }}
            />
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