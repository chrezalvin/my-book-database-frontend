import { Button, Card, Form, InputGroup, ListGroup, Modal } from "react-bootstrap";
import { Book } from "../../API/models/Book";
import { BookService } from "../../API/services/BookService";
import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateBook, updateBookSchema } from "../../API/schemas/BookSchema";
import { Genre } from "../../API/models/Genre";
import GenreLabel from "../../components/GenreLabel";
import GenreSearch from "../../components/GenreSearch";
import { GenreService } from "../../API/services/GenreService";
import { Author, authorCreate, AuthorCreate } from "../../API/models/Author";
import { Publisher, publisherCreate, PublisherCreate } from "../../API/models/Publisher";
import { AuthorService } from "../../API/services/AuthorService";
import { PublisherService } from "../../API/services/PublisherService";

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
  
  // author
  const [newAuthor, setNewAuthor] =  useState<Author | null | undefined>(undefined);
  const [authorKeyword, setAuthorKeyword] = useState<string>("");
  const [authorSearchResults, setAuthorSearchResults] = useState<Author[]>([]);
  const [isSearchingAuthor, setIsSearchingAuthor] = useState(false);
  
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState<string>("");
  const [newAuthorDescription, setNewAuthorDescription] = useState<string>("");

  // publisher
  const [newPublisher, setNewPublisher] =  useState<Publisher | null | undefined>(undefined);
  const [publisherKeyword, setPublisherKeyword] = useState<string>("");
  const [publisherSearchResults, setPublisherSearchResults] = useState<Publisher[]>([]);
  const [isSearchingPublisher, setIsSearchingPublisher] = useState(false);
  
  const [showAddPublisherModal, setShowAddPublisherModal] = useState(false);
  const [isAddingPublisher, setIsAddingPublisher] = useState(false);
  const [newPublisherName, setNewPublisherName] = useState<string>("");
  const [newPublisherDescription, setNewPublisherDescription] = useState<string>("");
  
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

  // -- author functions
  async function handleAddAuthor(){
    try{
      setIsAddingAuthor(true);

      const newAuthorData: AuthorCreate = {
        author_name: newAuthorName,
        author_description: newAuthorDescription,
      }

      const parsed = authorCreate.parse(newAuthorData);

      const newAuthor = await AuthorService.addNewAuthor(parsed);

      setNewAuthor(newAuthor);
    }
    catch(err){
      setError("Failed to add new author");
    }
    finally{
      setIsAddingAuthor(false);
      setShowAddAuthorModal(false);
    }
  }

  async function searchAuthors(keyword: string){
    try{
      setIsSearchingAuthor(true);

      const results = await AuthorService.searchAuthors(keyword);

      setAuthorSearchResults(results);
    }
    catch(err){
      setError("Failed to search authors");
    }
    finally{
      setIsSearchingAuthor(false);
    }
  }

  function handleAuthorInputChange(e: React.ChangeEvent<HTMLInputElement>){
    setNewAuthor(undefined); // reset newAuthor when user types in the input

    if(author != null)
      setAuthor(null);

    const value = e.target.value;
    setAuthorKeyword(value);
  }

  function handleAuthorModalOpen(){
    setNewAuthorName(authorKeyword);
    setShowAddAuthorModal(true);
  }

  function handleAuthorModalClose(){
    if(!isAddingAuthor){
      setShowAddAuthorModal(false);
    }
  }

  function handleAuthorSelected(author: Author){
    setNewAuthor(author);
    setAuthorSearchResults([]);
  }

  const authorSearchResultsUI = authorSearchResults.map((a) => (
    <ListGroup.Item
      key={a.author_id}
      action
      onClick={() => handleAuthorSelected(a)}
    >
      {a.author_name}
    </ListGroup.Item>
  ))

  // basic debouncing for author search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(authorKeyword.length > 0){
        searchAuthors(authorKeyword);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [authorKeyword]);

  // -- end author functions

  // -- publisher functions

    async function handleAddPublisher(){
    try{
      setIsAddingPublisher(true);

      const newPublisherData: PublisherCreate = {
        publisher_name: newPublisherName,
        publisher_description: newPublisherDescription,
      }

      const parsed = publisherCreate.parse(newPublisherData);

      const newPublisher = await PublisherService.addNewPublisher(parsed);

      setNewPublisher(newPublisher);
    }
    catch(err){
      setError("Failed to add new publisher");
    }
    finally{
      setIsAddingPublisher(false);
      setShowAddPublisherModal(false);
    }
  }

  async function searchPublishers(keyword: string){
    try{
      setIsSearchingPublisher(true);

      const results = await PublisherService.getPublishers(keyword);

      setPublisherSearchResults(results);
    }
    catch(err){
      setError("Failed to search publishers");
    }
    finally{
      setIsSearchingPublisher(false);
    }
  }

  function handlePublisherInputChange(e: React.ChangeEvent<HTMLInputElement>){
    setNewPublisher(undefined); // reset newPublisher when user types in the input

    if(publisher != null)
      setPublisher(null);

    const value = e.target.value;
    setPublisherKeyword(value);
  }

  function handlePublisherModalOpen(){
    setNewPublisherName(publisherKeyword);
    setShowAddPublisherModal(true);
  }

  function handlePublisherModalClose(){
    if(!isAddingPublisher){
      setShowAddPublisherModal(false);
    }
  }

  function handlePublisherSelected(publisher: Publisher){
    setNewPublisher(publisher);
    setPublisherSearchResults([]);
  }

  const publisherSearchResultsUI = publisherSearchResults.map((a) => (
    <ListGroup.Item
      key={a.publisher_id}
      action
      onClick={() => handlePublisherSelected(a)}
    >
      {a.publisher_name}
    </ListGroup.Item>
  ))

  // basic debouncing for publisher search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(publisherKeyword.length > 0){
        searchPublishers(publisherKeyword);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [publisherKeyword]);

  // -- end publisher functions

  const genreListUI = (newGenre ?? genre)?.map((g) => (
    <GenreLabel 
      genre={g}
      onDelete={removeGenre}
    />
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
      {/* Author Modal */}
      <Modal 
        show={showAddAuthorModal} 
        onHide={handleAuthorModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewAuthorName">
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              name="newAuthorName"
              value={newAuthorName}
              onChange={(e) => setNewAuthorName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewAuthorDescription">
            <Form.Label>Author Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newAuthorDescription"
              value={newAuthorDescription}
              onChange={(e) => setNewAuthorDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleAuthorModalClose}
            disabled={isAddingAuthor}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddAuthor}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Publisher Modal */}
      <Modal 
        show={showAddPublisherModal} 
        onHide={handlePublisherModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add A New Publisher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNewPublisherName">
            <Form.Label>Publisher Name</Form.Label>
            <Form.Control
              name="newPublisherName"
              value={newPublisherName}
              onChange={(e) => setNewPublisherName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNewPublisherDescription">
            <Form.Label>Publisher Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newPublisherDescription"
              value={newPublisherDescription}
              onChange={(e) => setNewPublisherDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handlePublisherModalClose}
            disabled={isAddingPublisher}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddPublisher}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

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
            <InputGroup>
              <Form.Control
                name="author"
                value={newAuthor?.author_name ?? author ?? authorKeyword}
                onChange={handleAuthorInputChange}
              />
              {
                !newAuthor && authorKeyword != "" && (
                  <Button 
                    variant="primary" 
                    id="add-author-button"
                    onClick={handleAuthorModalOpen}
                  >
                    Add New Author
                  </Button>
                )
              }
            </InputGroup>
            <ListGroup>
              {authorSearchResultsUI}
            </ListGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <InputGroup>
              <Form.Control
                name="publisher"
                value={newPublisher?.publisher_name ?? publisher ?? publisherKeyword}
                onChange={handlePublisherInputChange}
              />
              {
                !newPublisher && publisherKeyword != "" && (
                  <Button 
                    variant="primary" 
                    id="add-publisher-button"
                    onClick={handlePublisherModalOpen}
                  >
                    Add New Publisher
                  </Button>
                )
              }
            </InputGroup>
            <ListGroup>
              {publisherSearchResultsUI}
            </ListGroup>
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