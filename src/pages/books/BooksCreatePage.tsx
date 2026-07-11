import { Button, Card, Form, InputGroup, ListGroup, Modal } from "react-bootstrap";
import { BookService } from "../../API/services/BookService";
import { SubmitEvent, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CreateBook, createBookSchema, updateBookSchema } from "../../API/schemas/BookSchema";
import { Genre } from "../../API/models/Genre";
import GenreLabel from "../../components/GenreLabel";
import GenreSearch from "../../components/GenreSearch";
import SearchHelper from "../../components/SearchHelper";
import { GenreService } from "../../API/services/GenreService";
import { ZodError } from "zod";
import { Author } from "../../API/models/Author";
import { Publisher } from "../../API/models/Publisher";
import { AuthorService } from "../../API/services/AuthorService";
import { PublisherService } from "../../API/services/PublisherService";
import AuthorAddModal, { AuthorCreateAdd } from "../../components/Author/AuthorAddModal";
import PublisherAddModal, { PublisherCreateAdd } from "../../components/Publisher/PublisherAddModal";

function BooksCreatePage() {
    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const author_id = searchParams.get("author_id") ?? undefined;
    const publisher_id = searchParams.get("publisher_id") ?? undefined;

    const [title, setTitle] =  useState("");

    // author
    const [author, setAuthor] =  useState<Author | null>(null);
    const [authorKeyword, setAuthorKeyword] = useState<string>("");
    const [authorSearchResults, setAuthorSearchResults] = useState<Author[]>([]);
    const [isSearchingAuthor, setIsSearchingAuthor] = useState(false);
    
    const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
    const [isAddingAuthor, setIsAddingAuthor] = useState(false);
    
    // publisher
    const [publisher, setPublisher] =  useState<Publisher | null>(null);
    const [publisherKeyword, setPublisherKeyword] = useState<string>("");
    const [publisherSearchResults, setPublisherSearchResults] = useState<Publisher[]>([]);
    const [isSearchingPublisher, setIsSearchingPublisher] = useState(false);
    
    const [showAddPublisherModal, setShowAddPublisherModal] = useState(false);
    const [isAddingPublisher, setIsAddingPublisher] = useState(false);
    
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

    async function searchGenres(keyword: string): Promise<Genre[]> {
      try{
        const exclude_genre_ids = genreList.map(g => g.genre_id);
        const genres = GenreService.getGenres({keyword, exclude_genre_ids});
        return genres;
      }
      catch(err){
        console.error("Error searching genres:", err);
        return [];
      }
    }

    function handleAuthorModalOpen(){
      setShowAddAuthorModal(true);
    }

    function handleAuthorModalClose(){
      if(!isAddingAuthor){
        setShowAddAuthorModal(false);
      }
    }

    async function handleAddAuthor(authorData: AuthorCreateAdd): Promise<void> {
      try{
        setIsAddingAuthor(true);

        const newAuthor = await AuthorService.addNewAuthor({
          author_name: authorData.author_name,
          author_description: authorData.author_description,
        }, authorData.file ?? undefined);

        setAuthor(newAuthor);
        setShowAddAuthorModal(false);
      }
      catch(err){
        console.error("Error adding new author:", err);
      }
      finally{
        setIsAddingAuthor(false);
      }
    }

    function handleAuthorInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const keyword = e.target.value;
      setAuthorKeyword(keyword);
      setAuthor(null); // Clear the selected author when typing

      if(keyword.length === 0){
        setAuthorSearchResults([]);
      }
    }

    async function searchAuthors(keyword: string): Promise<void> {
      try{
        setIsSearchingAuthor(true);
        const authors = await AuthorService.searchAuthors(keyword);
        
        setAuthorSearchResults(authors);
      }
      catch(err){
        console.error("Error searching authors:", err);
      }
      finally{
        setIsSearchingAuthor(false);
      }
    }

    function handlePublisherModalOpen(){
      setShowAddPublisherModal(true);
    }

    function handlePublisherModalClose(){
      if(!isAddingPublisher){
        setShowAddPublisherModal(false);
      }
    }

    async function handleAddPublisher(publisherData: PublisherCreateAdd): Promise<void> {
      try{
        const newPublisher = await PublisherService.addNewPublisher({
          publisher_name: publisherData.publisher_name,
          publisher_description: publisherData.publisher_description,
        }, publisherData.file ?? undefined);

        setPublisher(newPublisher);
        setShowAddPublisherModal(false);
      }
      catch(err){
        console.error("Error adding new publisher:", err);
      }
    }

    function handlePublisherInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      const keyword = e.target.value;
      setPublisherKeyword(keyword);
      setPublisher(null); // Clear the selected publisher when typing

      if(keyword.length === 0){
        setPublisherSearchResults([]);
      }
    }

    async function searchPublishers(keyword: string): Promise<void> {
      try{
        setIsSearchingPublisher(true);
        const publishers = await PublisherService.getPublishers(keyword);

        setPublisherSearchResults(publishers);
      }
      catch(err){
        console.error("Error searching publishers:", err);
      }
      finally{
        setIsSearchingPublisher(false);
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

    // debouncing for author search
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if(authorKeyword.length > 0){
          searchAuthors(authorKeyword);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [authorKeyword]);

    // debouncing for publisher search
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if(publisherKeyword.length > 0){
          searchPublishers(publisherKeyword);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }, [publisherKeyword]);

    useEffect(() => {
      handleInitialAuthorAndPublisher();
    }, []);

    const genreListUI = genreList.map((g) => (
      <GenreLabel 
        key={g.genre_id} 
        genre_name={g.genre_name}
        genre_id={g.genre_id}
        onDelete={(genre_id) => {
          setGenreList(genreList.filter((g) => g.genre_id !== genre_id));
        }}
      />
    ))

    const authorSearchResultsUI = authorSearchResults.map((a) => (
      <ListGroup.Item 
        key={a.author_id}
        action
        onClick={() => {
          setAuthor(a);
          setAuthorSearchResults([]);
        }}
      >
        {a.author_name}
      </ListGroup.Item>
    ))

    const publisherSearchResultsUI = publisherSearchResults.map((p) => (
      <ListGroup.Item 
        key={p.publisher_id}
        action
        onClick={() => {
          setPublisher(p);
          setPublisherSearchResults([]);
        }}
      >
        {p.publisher_name}
      </ListGroup.Item>
    ))

    return (
    <Card className="shadow-sm">
      <AuthorAddModal 
        onAdd={handleAddAuthor}
        onClose={handleAuthorModalClose}
        initialAuthor={{
          author_name: authorKeyword,
        }}
        show={showAddAuthorModal}
        isLoading={isAddingAuthor}
      />

      <PublisherAddModal 
        onAdd={handleAddPublisher}
        onClose={handlePublisherModalClose}
        initialPublisher={{
          publisher_name: publisherKeyword,
        }}
        show={showAddPublisherModal}
        isLoading={isAddingPublisher}
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
            <InputGroup>
              <Form.Control
                name="author"
                value={author?.author_name ?? authorKeyword}
                onChange={handleAuthorInputChange}
                isInvalid={isFormValidated && !!errorMap["author"]}
              />
              {
                !author && authorKeyword != "" && (
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
            <Form.Control.Feedback className="text-danger" type="invalid">
              {errorMap["author"]}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <InputGroup>
              <Form.Control
                name="publisher"
                value={publisher?.publisher_name ?? publisherKeyword}
                onChange={handlePublisherInputChange}
                isInvalid={isFormValidated && !!errorMap["publisher"]}
              />
              {
                !publisher && publisherKeyword != "" && (
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

            <SearchHelper 
              show={isAddingGenre}
              placeholder="Search genres..."
              searchByKeyword={searchGenres}
              convertToListItem={(g) => {
                return {
                  item: g,
                  value: g.genre_name,
                  key: g.genre_id,
                }
              }}
              
              onHelperSelect={(g) => {
                setGenreList([...genreList, g]);
                setIsAddingGenre(false);
              }}

              buttonSetting={{
                canAddFromKeyword: (keyword) => {
                  // check if keyword is not empty and not already in genreList
                  return keyword.length > 0 && !genreList.some(g => g.genre_name.toLowerCase() === keyword.toLowerCase());
                },
                buttonText: "Add Genre",
                onButtonClick: async (keyword) => {
                  return await GenreService.addNewGenre({genre_name: keyword});
                },
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