import { axiosInstance } from "../axiosConfig";
import { Book, bookModel } from "../models/Book";
import { CreateBook, UpdateBook } from "../schemas/BookSchema";

export class BookService {
    static async getBooksByPage(page: number, keyword?: string): Promise<Book[]> {
        const res = await axiosInstance.get(`/books`, {
            params: {
                page: page,
                keyword: keyword || "",
            }
        });
    
        const data = res.data as unknown;
    
        if(!Array.isArray(data))
            throw new Error(`Response data is not an array: ${JSON.stringify(data)}`);
    
        const books: Book[] = [];
        for(const item of data){
            const parsed = bookModel.parse(item);
    
            books.push(parsed);
        }
    
        return books;
    }
    
    static async getOneBook(book_id: Book["book_id"]): Promise<Book> {
        const res = await axiosInstance.get(`/books/${book_id}`);
    
        const data = res.data as unknown;
    
        const parsed = bookModel.parse(data);
    
        return parsed;
    }
    
    static async addNewBook(book: CreateBook, cover_img?: File): Promise<Book>{
        const formData = new FormData();
        formData.append("book", JSON.stringify(book));
        if(cover_img)
            formData.append("image", cover_img);
    
        const res = await axiosInstance.post(`/books/add`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        const parsed = bookModel.parse(res.data);
    
        return parsed;
    }
    
    static async editBook(book_id: Book["book_id"], bookPartial: UpdateBook, cover_img?: File): Promise<Book>{
        const formData = new FormData();
        formData.append("book", JSON.stringify(bookPartial));
        if(cover_img)
            formData.append("image", cover_img);
        
        const res = await axiosInstance.post(`/books/${book_id}/edit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        const parsed = bookModel.parse(res.data);
    
        return parsed;
    }
    
    static async deleteBook(book_id: Book["book_id"]): Promise<boolean>{
        const res = await axiosInstance.get(`/books/${book_id}/delete`);
        
        if(!("success" in res.data))
            throw new Error(`Response data does not contain 'success' property: ${JSON.stringify(res.data)}`);
    
        if(typeof res.data.success !== "boolean")
            throw new Error(`'success' property is not a boolean: ${JSON.stringify(res.data.success)}`);
    
        return res.data.success;
    }
}