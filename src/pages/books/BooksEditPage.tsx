import { Button, Card } from "react-bootstrap";
import { Book } from "../../API/models/Book";
import * as BookService from "../../API/services/BookService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookUpdate } from "../../API/schemas/BookSchema";
import BookUpdateForm from "../../components/Book/Form/BookUpdateForm";
import { AxiosError } from "axios";
import { useCustomPath } from "../useCustomPath";

export function BooksEditPage() {
	const {book_id} = useParams<{book_id: string}>();
	const {gotoBooks} = useCustomPath();
	
	// initial book state
	const [initialBook, setInitialBook] = useState<Book | null>(null);
	
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	
	async function loadBooks(book_id: string){
		try{
			setInitialBook(null);
			
			const book = await BookService.getOneBook(book_id);
			
			setInitialBook(book);
		}
		catch(err){
			setError("Failed to load book data");
		}
	}
	
	async function editBook(book: Book, bookUpdate: BookUpdate){
		try{
			setIsEditing(true);
			setError(null);
			await BookService.editBook(book.book_id, bookUpdate);
			
			gotoBooks();
		}
		catch(error){
			if(error instanceof AxiosError)
				setError(error.response?.data.error);
			else{
				console.error("Error adding genre:", error);
				setError("Unknown error occured!");
			}
		}
		finally{
			setIsEditing(false);
		}
	}
	
	useEffect(() => {
		if(!book_id){
			gotoBooks();
			return;
		}
		
		loadBooks(book_id);
	}, [])
	
	if(!initialBook){
		return <p>Loading book data...</p>;
	}
	
	return (
		<Card className="shadow-sm">
			<Card.Body>
				<BookUpdateForm 
					initialBook={initialBook}
					onUpdate={editBook}
					disabled={isEditing}
					id="book-edit"
				/>
				<p className="text-danger">
					{error}
				</p>
				<Button
					// type="submit"
					form="book-edit"
					disabled={isEditing}
				>
					Save Changes
				</Button>
			</Card.Body>
		</Card>
	);
}

export default BooksEditPage;