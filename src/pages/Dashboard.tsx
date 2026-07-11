import { useEffect, useState, useRef } from "react";
import { BookService } from "../API/services/BookService";
import { Book } from "../API/models/Book";

import {
    Alert,
    Button,
    Col,
    Row,
} from "react-bootstrap";
import BookCard from "../components/Book/BookCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/customRedux";
import BookSearch from "../components/BookSearch";
import DeleteBookModal from "../components/Book/DeleteBookModal";
import BookDetailsModal from "../components/Book/BookDetailsModal";

export interface Dashboard {
  additionalParams?: {
    author_id?: string;
    publisher_id?: string;
  }
}

function Dashboard(props: Dashboard) {
    const user = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // infinite scrolling pagination
    const [page, setPage] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    
    const allowedToEdit = user !== null;
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const [selectedBookToDelete, setSelectedBookToDelete] = useState<Book | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const [searchKeyword, setSearchKeyword] = useState<string | null>(null);

    function gotoAuthorPage(author_id: string){
      navigate(`/authors/${author_id}`);
    }

    function gotoPublisherPage(publisher_id: string){
      navigate(`/publishers/${publisher_id}`);
    }

    async function deleteSelectedBook(){
      if(!selectedBookToDelete)
        return;

      try{
        setIsDeleting(true);

        const isDeleted = await BookService.deleteBook(selectedBookToDelete.book_id);

        if(isDeleted){
          resetPaginationAndFetchBooks();
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

    async function fetchBooks(pageNo: number){
      try{
        setIsLoading(true);

        const books = await BookService.getBooksByPage({
          page: pageNo, 
          keyword: searchKeyword ?? undefined,
          ...props.additionalParams
        });

        console.log("Fetched books:", books);

        setBooks(prev => [...prev, ...books]);
        setHasMore(books.length > 0);
      }
      catch(err){
        setError("Failed to fetch books");
      }
      finally{
        setIsLoading(false);
      }
    }

    async function resetPaginationAndFetchBooks(){
      try{
        setIsLoading(true);
        setError(null);
        setBooks([]);
        setPage(null);

        const books = await BookService.getBooksByPage({
          page: 0, 
          keyword: searchKeyword ?? undefined,
          ...props.additionalParams
        });

        setBooks(books);
        setHasMore(books.length > 0);
      }
      catch(err){
        setError("Failed to fetch books");
      }
      finally{
        setIsLoading(false);
      }
    }

    // basic debouncing for search
    useEffect(() => {
      if(searchKeyword === null)
        return;

      const delayDebounceFn = setTimeout(() => {
        resetPaginationAndFetchBooks();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }, [searchKeyword]);

    // initial fetch
    useEffect(() => {
      fetchBooks(0);
    }, [])

    // infinite scrolling pagination
    useEffect(() => {
      if(!hasMore)
        return;

      if(page === null)
        return;

      setIsLoading(true);
      fetchBooks(page);
    }, [page])

    // infinite scrolling intersection observer
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && hasMore) {
          setPage((prev) => (prev ?? 0) + 1);
        }
      }, {
        threshold: 1.0
      });

      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }

      return () => {
        if (loaderRef.current) {
          observer.unobserve(loaderRef.current);
        }
      };
    }, [isLoading, hasMore]);

  return (
    <>
      {/* search */}
      <BookSearch 
        onChange={(value) => setSearchKeyword(value)}
        value={searchKeyword ?? ""}
      />

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
              onAuthorClick={props.additionalParams?.author_id ? undefined : gotoAuthorPage}
              onPublisherClick={props.additionalParams?.publisher_id ? undefined : gotoPublisherPage}
            />
          </Col>
        ))}
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {
        hasMore && !isLoading && (
          <div ref={loaderRef}></div>
        )
      }

      <DeleteBookModal 
        book={selectedBookToDelete}
        deleteError={deleteError}
        isDeleting={isDeleting}
        onClose={() => { setSelectedBookToDelete(null); }}
        onDelete={ deleteSelectedBook }
      />

      <BookDetailsModal 
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}

export default Dashboard;