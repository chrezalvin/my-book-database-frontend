import { Button, Card, Form } from "react-bootstrap";
import { Book } from "../../API/models/Book";
import { BookService } from "../../API/services/BookService";
import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateBook, updateBookSchema } from "../../API/schemas/BookSchema";
import { Genre } from "../../API/models/Genre";
import GenreLabel from "../../components/GenreLabel";
import GenreSearch from "../../components/GenreSearch";
import { GenreService } from "../../API/services/GenreService";

function BooksEditPage() {
  const {book_id} = useParams<{book_id: string}>();
  const navigate = useNavigate();

  // initial book state
  const [title, setTitle] =  useState<Book["title"]>("");
  const [author, setAuthor] =  useState<Book["author_name"]>("");
  const [publisher, setPublisher] =  useState<Book["publisher_name"]>("");
  const [publicationYear, setPublicationYear] =  useState<Book["publication_year"]>(2023);
  const [summary, setSummary] =  useState<Book["summary"]>("");
  const [language, setLanguage] =  useState<Book["language"]>("en");
  const [genre, setGenre] =  useState<Genre[] | null>(null);
  const [isbn, setIsbn] =  useState<Book["isbn"]>(null);
  const [edition, setEdition] =  useState<Book["edition"]>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);

  // update book state
  const [newTitle, setNewTitle] =  useState<Book["title"] | undefined>(undefined);
  const [newAuthor, setNewAuthor] =  useState<Book["author_name"] | undefined>(undefined);
  const [newPublisher, setNewPublisher] =  useState<Book["publisher_name"] | undefined>(undefined);
  const [newPublicationYear, setNewPublicationYear] =  useState<Book["publication_year"] | undefined>(undefined);
  const [newSummary, setNewSummary] =  useState<Book["summary"] | undefined>(undefined);
  const [newLanguage, setNewLanguage] =  useState<Book["language"] | undefined>(undefined);
  const [newGenre, setNewGenre] =  useState<Genre[] | null | undefined>(undefined);
  const [newIsbn, setNewIsbn] =  useState<Book["isbn"] | undefined>(undefined);
  const [newEdition, setNewEdition] =  useState<Book["edition"] | undefined>(undefined);
  const [newCoverFile, setNewCoverFile] =  useState<File | undefined>(undefined);

  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [isBookLoaded, setIsBookLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadBooks(book_id: string){
      try{
          setIsBookLoaded(false);

          const book = await BookService.getOneBook(book_id);

          setTitle(book.title);
          setAuthor(book.author_name);
          setPublisher(book.publisher_name);
          setPublicationYear(book.publication_year);
          setSummary(book.summary);
          setLanguage(book.language);
          setGenre(book.genres);
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

      const updateBook: UpdateBook = {};

      if(newTitle !== undefined) updateBook.title = newTitle;
      if(newAuthor !== undefined) updateBook.author_id = newAuthor;
      if(newPublisher !== undefined) updateBook.publisher_id = newPublisher;
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

  function addGenre(addedGenre: Genre){
    let updatedGenre: Genre[] | null = null

    // add existing genres to updatedGenre if newGenre is undefined
    if(newGenre === undefined)
      updatedGenre = genre;
    else
      updatedGenre = newGenre;

    // if updatedGenre is null, initialize it as an empty array
    if(updatedGenre === null)
      updatedGenre = [];

    // add the new genre to the updatedGenre list
    updatedGenre.push(addedGenre);

    setNewGenre(updatedGenre);
  }

  function removeGenre(removedGenre: Genre){
    let updatedGenre: Genre[] | null = null;

    // add existing genres to updatedGenre if newGenre is undefined
    if(newGenre === undefined)
      updatedGenre = genre;
    else
      updatedGenre = newGenre;

    // if updatedGenre is null, set the updatedGenre to null and return
    if(updatedGenre === null){
      setNewGenre(null);
      return;
    }

    // filter out the removed genre from the updatedGenre list
    updatedGenre = updatedGenre.filter((g) => g.genre_id !== removedGenre.genre_id);

    setNewGenre(updatedGenre);
  }

  const genreListUI = (newGenre ?? genre)?.map((g) => (
    <GenreLabel 
      genre={g}
      onDelete={removeGenre}
    />
  ));

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={newTitle ?? title}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              name="author"
              value={newAuthor ?? author}
              onChange={(e) => setNewAuthor(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              name="publisher"
              value={newPublisher ?? publisher}
              onChange={(e) => setNewPublisher(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publication Year</Form.Label>
            <Form.Control
              type="number"
              name="publication_year"
              value={newPublicationYear ?? publicationYear}
              onChange={(e) => setNewPublicationYear(e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Summary</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="summary"
              value={newSummary ?? summary}
              onChange={(e) => setNewSummary(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Control
              type="text"
              name="language"
              value={newLanguage ?? language}
              onChange={(e) => setNewLanguage(e.target.value)}
            />
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
              currentGenres={newGenre ?? genre ?? undefined}
              onGenreSelect={(g) => {
                addGenre(g);
                setIsAddingGenre(false);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edition</Form.Label>
            <Form.Control
              type="text"
              name="edition"
              value={newEdition ?? edition ?? undefined}
              onChange={(e) => setNewEdition(e.target.value || null)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={newIsbn ?? isbn ?? undefined}
              onChange={(e) => setNewIsbn(e.target.value || null)}
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