import { Button, Card, Form } from "react-bootstrap";
import { Book } from "../../API/models/Book";
import { BookFormData } from "../../API/models/BookFormData";
import { editBook, getOneBook } from "../../API/services/BookService";
import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function BooksEditPage() {
    const {book_id} = useParams<{book_id: string}>();
    const navigate = useNavigate();

    const [title, setTitle] =  useState<Book["title"]>("");
    const [author, setAuthor] =  useState<Book["author"]>("");
    const [publisher, setPublisher] =  useState<Book["publisher"]>("");
    const [publicationYear, setPublicationYear] =  useState<Book["publication_year"]>(2023);
    const [summary, setSummary] =  useState<Book["summary"]>("");
    const [language, setLanguage] =  useState<Book["language"]>("en");
    const [genre, setGenre] =  useState<Book["genre"]>("fantasy");

    const [isbn, setIsbn] =  useState<Book["isbn"]>(null);
    const [edition, setEdition] =  useState<Book["edition"]>(null);

    const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
    const [coverFile, setCoverFile] =  useState<File | null>(null);

    const [isBookLoaded, setIsBookLoaded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadBooks(book_id: string){
        try{
            setIsBookLoaded(false);

            const book = await getOneBook(book_id);

            setTitle(book.title);
            setAuthor(book.author);
            setPublisher(book.publisher);
            setPublicationYear(book.publication_year);
            setSummary(book.summary);
            setLanguage(book.language);
            setGenre(book.genre);
            setIsbn(book.isbn);
            setEdition(book.edition);

            if(book.cover_img)
               setExistingCoverUrl(book.cover_img);
        
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

        const updatedBookData: BookFormData = {
            title,
            author,
            publisher,
            publication_year: publicationYear,
            summary,
            language,
            genre,
            isbn,
            edition,
        };

        try{
            setError(null);
            setIsSubmitting(true);
            const book = await editBook(book_id, updatedBookData, coverFile || undefined);

            navigate("/books");
        }
        catch(err){
            setError("Failed to edit book");
        }
        finally{
            setIsSubmitting(false);
        }
    }

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
              value={publicationYear}
              onChange={(e) => setPublicationYear(parseInt(e.target.value) || 2023)}
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

            {existingCoverUrl && (
              <div className="mb-2">
                <img
                  src={existingCoverUrl}
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