import { axiosInstance } from "../axiosConfig";
import { Book, isBook } from "../models/Book";

export async function getBooksByPage(page: number, keyword?: string): Promise<Book[]> {
    const res = await axiosInstance.get(`/books`, {
        params: {
            page: page,
            keyword: keyword || "",
        }
    });

    const data = res.data as unknown;

    if(!Array.isArray(data))
        throw new Error(`Response data is not an array: ${JSON.stringify(data)}`);

    for(const item of data)
        if(!isBook(item))
            throw new Error(`Response data contains an invalid Book: ${JSON.stringify(item)}`);

    return data;
}

export async function getOneBook(book_id: Book["book_id"]): Promise<Book> {
    const res = await axiosInstance.get(`/books/${book_id}`);

    const data = res.data as unknown;

    if(!isBook(data))
        throw new Error(`Response data is not a valid Book: ${JSON.stringify(data)}`);

    return data;
}

export async function addNewBook(book: Omit<Book, "book_id" | "created_at" | "cover_img">, cover_img?: File): Promise<Book>{
    const formData = new FormData();
    formData.append("book", JSON.stringify(book));
    if(cover_img)
        formData.append("image", cover_img);

    const res = await axiosInstance.post(`/books/add`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if(!isBook(res.data))
        throw new Error(`Response data is not a valid Book: ${JSON.stringify(res.data)}`);

    return res.data;
}

export async function editBook(book_id: Book["book_id"], bookPartial: Partial<Omit<Book, "book_id" | "created_at" | "cover_img">>, cover_img?: File): Promise<Book>{
    const formData = new FormData();
    formData.append("book", JSON.stringify(bookPartial));
    if(cover_img)
        formData.append("image", cover_img);
    
    const res = await axiosInstance.post(`/books/edit/${book_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if(!isBook(res.data))
        throw new Error(`Response data is not a valid Book: ${JSON.stringify(res.data)}`);

    return res.data;
}

export async function deleteBook(book_id: Book["book_id"]): Promise<boolean>{
    const res = await axiosInstance.get(`/books/delete/${book_id}`);
    
    if(!("success" in res.data))
        throw new Error(`Response data does not contain 'success' property: ${JSON.stringify(res.data)}`);

    if(typeof res.data.success !== "boolean")
        throw new Error(`'success' property is not a boolean: ${JSON.stringify(res.data.success)}`);

    return res.data.success;
}