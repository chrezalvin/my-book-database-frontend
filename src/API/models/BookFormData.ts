import { Book } from "./Book";

export interface BookFormData extends Omit<Book, "cover_img" | "book_id" | "created_at"> {
}