import { useEffect, useState } from "react";
import { deleteBook, getBooksByPage } from "../../API/services/BookService";
import { Book } from "../../API/models/Book";

import {
    Alert,
    Button,
    Col,
    Modal,
    Row,
    Spinner
} from "react-bootstrap";
import BookCard from "../../components/BookCard";
import PaginationControls from "../../components/PaginationControl";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/customRedux";
import BookSearch from "../../components/BookSearch";

function BooksPage() {
    const {page} = useParams<{page?: string}>();
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const currentPage = page ? Number(page) : 0;

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const allowedToEdit = user !== null;
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const [selectedBookToDelete, setSelectedBookToDelete] = useState<Book | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [searchKeyword, setSearchKeyword] = useState<string>("");

    function gotoNextPage(){
      navigate(`/books/page/${currentPage + 1}`);
    }

    function gotoPreviousPage(){
      navigate(`/books/page/${Math.max(currentPage - 1, 0)}`);
    }

    async function deleteSelectedBook(){
      if(!selectedBookToDelete)
        return;

      try{
        setIsDeleting(true);

        const isDeleted = await deleteBook(selectedBookToDelete.book_id);

        if(isDeleted){
          fetchBooks();
          setSelectedBookToDelete(null);
        }
      }
      catch(err){
        setDeleteError("Failed to delete book");
      }
      finally{
        setIsDeleting(false);
      }
    }

    async function fetchBooks(setPage?: number){
      if(setPage !== undefined){
        navigate(`/books/page/${setPage}`);
      }

      try{
        setIsLoading(true);

        const books = await getBooksByPage(currentPage, searchKeyword);

        setBooks(books);
      }
      catch(err){
        setError("Failed to fetch books");
      }
      finally{
        setIsLoading(false);
      }
    }

    useEffect(() => {
      fetchBooks();
    }, [currentPage]);

    // basic debouncing for search
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        fetchBooks(0);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }, [searchKeyword]);

  return (
    <>
      {
        (!isLoading && allowedToEdit) && (
          <Button
            className="mb-3"
            onClick={() => navigate("/books/create")}
            disabled={isLoading}
          >
            Add New Book
          </Button>
        )
      }

      {/* search */}
      <BookSearch 
        onChange={(value) => setSearchKeyword(value)}
        value={searchKeyword}
      />

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <div className="mt-2">Loading books...</div>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!isLoading && !error && (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {books.map((book) => (
            <Col key={book.book_id}>
              <BookCard
                book={book}
                onView={setSelectedBook}
                onDelete={setSelectedBookToDelete}
                onEdit={(book) => navigate(`/books/edit/${book.book_id}`)}
                allowedToEdit={allowedToEdit}
                allowedToDelete={allowedToEdit}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Delete modal */}
      <Modal
        show={!!selectedBookToDelete}
        onHide={() => { setSelectedBookToDelete(null); }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm Delete {selectedBookToDelete?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this book?
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setSelectedBookToDelete(null); }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => { deleteSelectedBook(); }} 
            disabled={isDeleting}
          >
            Delete
          </button>
          {deleteError && (
            <Alert variant="danger" className="mt-2">
              {deleteError}
            </Alert>
          )}
        </Modal.Footer>
      </Modal>

      {/* View modal */}
      <Modal
        show={!!selectedBook}
        onHide={() => setSelectedBook(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedBook?.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>Author:</strong> {selectedBook?.author}</p>
          <p><strong>Publisher:</strong> {selectedBook?.publisher}</p>
          <p><strong>Year:</strong> {selectedBook?.publication_year}</p>
          <p><strong>Language:</strong> {selectedBook?.language}</p>
          <p><strong>Genre:</strong> {selectedBook?.genre}</p>
          <p className="mt-3">{selectedBook?.summary}</p>
        </Modal.Body>
      </Modal>

      <PaginationControls 
        currentPage={currentPage}
        isLoading={isLoading}
        onPrevious={gotoPreviousPage}
        onNext={gotoNextPage}
      />
    </>
  );
}

export default BooksPage;