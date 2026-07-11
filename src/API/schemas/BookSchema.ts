import z from "zod";
import { bookModel } from "../models/Book";

export const createBookSchema = bookModel.omit({
    genres: true,
    book_id: true,
    created_at: true,
    cover_img: true,
    author_name: true,
    publisher_name: true,
}).extend({
    title: bookModel.shape.title.trim().min(1, { message: "Title is required" }),
    author_id: bookModel.shape.author_id,
    publisher_id: bookModel.shape.publisher_id,
    publication_year: bookModel.shape.publication_year
        .min(1000, { message: "Publication year must be a valid year" })
        .max(new Date().getFullYear(), { message: "Publication year cannot be in the future" }),

    genre_ids: z.array(z.uuid()).optional(),
});

export const updateBookSchema = createBookSchema.partial()

export type CreateBook = z.infer<typeof createBookSchema>;
export type UpdateBook = z.infer<typeof updateBookSchema>;