import { useNavigate } from "react-router-dom";
import { Book } from "../API/models/Book";
import { Author } from "../API/models/Author";
import { Publisher } from "../API/models/Publisher";
import { Genre } from "../API/models/Genre";
import axios from "axios";

export function useCustomPath(){
    const navigate = useNavigate();

    return {
        gotoLogin: () => {
            return navigate("/login");
        },
        gotoBooks: () => {
            return navigate("/books");
        },
        gotoBooksCreate: (
            params?: {
                author_id?: Author["author_id"],
                publisher_id?: Publisher["publisher_id"],
                genre_id?: Genre["genre_id"]
            }
        ) => {
            return navigate(axios.getUri({
                url: "/books/create", 
                params
            }));
        },
        gotoBooksEdit: (bookId: Book["book_id"]) => {
            return navigate(`/books/edit/${bookId}`);
        },
        gotoAuthor: (authorId?: Author["author_id"]) => {
            return navigate(`/authors${authorId ? `/${authorId}` : ""}`);
        },
        gotoPublisher: (publisherId?: Publisher["publisher_id"]) => {
            return navigate(`/publishers${publisherId ? `/${publisherId}` : ""}`);
        },
        gotoGenre: (genreId: Genre["genre_id"]) => {
            return navigate(`/genres${genreId ? `/${genreId}` : ""}`);
        }
    }
}