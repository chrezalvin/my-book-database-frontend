import { Button, Card, Form } from "react-bootstrap";
import { BookFormData } from "../../API/models/BookFormData";
import { addNewBook } from "../../API/services/BookService";
import { SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function BooksCreatePage() {
    const navigate = useNavigate();

    const [title, setTitle] =  useState("");
    const [author, setAuthor] =  useState("");
    const [publisher, setPublisher] =  useState("");
    const [publicationYear, setPublicationYear] =  useState<number>(2023);
    const [summary, setSummary] =  useState("");
    const [coverFile, setCoverFile] =  useState<File | null>(null);
    const [genre, setGenre] =  useState("fantasy");
    const [language, setLanguage] =  useState("en");
    const [edition, setEdition] =  useState<string | null>(null);
    const [isbn, setIsbn] =  useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        try {
            setIsSubmitting(true);

            const newBookData: BookFormData = {
                title,
                author,
                publisher,
                publication_year: publicationYear,
                summary,
                genre,
                language,

                edition,
                isbn,
            };

              for(const key in newBookData){
                  const k = key as keyof BookFormData;
                  const data = newBookData[k];
                  if(typeof data === "string"){
                    (newBookData[k] as string) = data.trim();
                  }
              }

            const newBook = await addNewBook(newBookData, coverFile ?? undefined);

            navigate(`/books`);
        }
        catch(err){
            setError("Failed to create book");
        }
        finally{
            setIsSubmitting(false);
        }
    } 

    return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              name="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              name="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publication Year</Form.Label>
            <Form.Control
              type="number"
              name="publication_year"
              value={publicationYear ?? ""}
              onChange={(e) => setPublicationYear(e.target.value ? parseInt(e.target.value) : 2023)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              name="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
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
              value={edition ?? ""}
              onChange={(e) => setEdition(e.target.value ? e.target.value : null)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={isbn ?? ""}
              onChange={(e) => setIsbn(e.target.value ? e.target.value : null)}
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

            <Form.Text className="text-muted">
              Leave empty to keep existing cover
            </Form.Text>
          </Form.Group>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Create Book
          </Button>

            {error && (
                <p className="text-danger mt-3">{error}</p>
            )}
        </Form>
      </Card.Body>
    </Card>
    )
}

export default BooksCreatePage;