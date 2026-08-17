import { axiosInstance } from "../axiosConfig";
import { Book, bookModel } from "../models/Book";
import { BookCreate, BookUpdate } from "../schemas/BookSchema";

export async function getBooksByPage(
    params: {
        page: number, 
        keyword?: string,
        author_id?: string,
        publisher_id?: string,
    }
): Promise<Book[]> {
    const res = await axiosInstance.get(`/books`, {params});

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

export async function getOneBook(book_id: Book["book_id"]): Promise<Book> {
    const res = await axiosInstance.get(`/books/${book_id}`);

    const data = res.data as unknown;

    const parsed = bookModel.parse(data);

    return parsed;
}

export async function addNewBook(bookCreate: BookCreate): Promise<Book>{
    const formData = new FormData();
    formData.append("book", JSON.stringify(bookCreate.book));

    if(bookCreate.genre_ids)
        formData.append("genre_ids", bookCreate.genre_ids.toString());

    if(bookCreate.image)
        formData.append("image", bookCreate.image);

    const res = await axiosInstance.post(`/books`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = bookModel.parse(res.data);

    return parsed;
}

export async function editBook(book_id: Book["book_id"], bookUpdate: BookUpdate): Promise<Book>{
    const formData = new FormData();
    formData.append("book", JSON.stringify(bookUpdate.book));

    if(bookUpdate.genre_ids)
        formData.append("genre_ids", bookUpdate.genre_ids.toString());

    if(bookUpdate.image)
        formData.append("image", bookUpdate.image);
    
    const res = await axiosInstance.patch(`/books/${book_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const parsed = bookModel.parse(res.data);

    return parsed;
}

export async function deleteBook(book_id: Book["book_id"]): Promise<true>{
    await axiosInstance.delete(`/books/${book_id}`);
    
    return true;
}