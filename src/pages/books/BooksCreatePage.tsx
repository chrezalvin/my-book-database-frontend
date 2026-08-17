import { Button, Card } from "react-bootstrap";
import * as BookService from "../../API/services/BookService";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookCreate } from "../../API/schemas/BookSchema";
import BookCreateForm from "../../components/Book/Form/BookCreateForm";
import { useCustomPath } from "../useCustomPath";

export function BooksCreatePage() {
    const {gotoPublisher, gotoAuthor, gotoBooks} = useCustomPath();
    
    const [searchParams] = useSearchParams();
    const author_id = searchParams.get("author_id") ?? undefined;
    const publisher_id = searchParams.get("publisher_id") ?? undefined;

    const [isLoading, setIsLoading] = useState(false);

    async function submitBook(bookCreate: BookCreate){
      try{
        setIsLoading(true);

        const newBook = await BookService.addNewBook(bookCreate);

        // go to appropriate page after submitting
        if(publisher_id)
          gotoPublisher(publisher_id);
        else if(author_id)
          gotoAuthor(author_id);
        else
          gotoBooks();
      }
      catch(err){

      }
      finally{
        setIsLoading(false);
      }
    }

    return (
    <Card className="shadow-sm">
      <Card.Body>
        <BookCreateForm 
          initialBook={{
            book: {
              author_id: author_id ?? null,
              publisher_id: publisher_id ?? null,
              edition: null,
              isbn: null,
              language: "en",
              publication_year: 0,
              summary: "",
              title: "",
            },
          }}
          onCreate={submitBook}
          disabled={isLoading}
          id="book-create"
        />

        <Button
          type="submit"
          form="book-create"
          disabled={isLoading}
        >
          Create Book
        </Button>
      </Card.Body>
    </Card>
    )
}

export default BooksCreatePage;