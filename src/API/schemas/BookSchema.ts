import z from "zod";
import { bookModel } from "../models/Book";

export const createBookSchema = bookModel.omit({
    genres: true,
    book_id: true,
    created_at: true,
    cover_img: true,
}).extend({
    title: bookModel.shape.title.trim().min(1, { message: "Title is required" }),
    author: bookModel.shape.author.trim().min(1, { message: "Author is required" }),
    publisher: bookModel.shape.publisher.trim().min(1, { message: "Publisher is required" }),
    publication_year: bookModel.shape.publication_year
        .min(1000, { message: "Publication year must be a valid year" })
        .max(new Date().getFullYear(), { message: "Publication year cannot be in the future" }),

    genre_ids: z.array(z.uuid()).optional(),
});

export const updateBookSchema = createBookSchema.partial()

export type CreateBook = z.infer<typeof createBookSchema>;
export type UpdateBook = z.infer<typeof updateBookSchema>;