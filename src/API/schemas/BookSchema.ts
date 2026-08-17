import z from "zod";
import { bookModel } from "../models/Book";
import { genreModel } from "../models/Genre";

const createBookBase = bookModel.omit({
    genres: true,
    book_id: true,
    created_at: true,
    cover_img: true,
    author: true,
    publisher: true
}).extend({
    title: bookModel.shape.title.trim().min(1, { message: "Title is required" }),
    author_id: bookModel.shape.author_id,
    publisher_id: bookModel.shape.publisher_id,
    publication_year: bookModel.shape.publication_year
        .min(1000, { message: "Publication year must be a valid year" })
        .max(new Date().getFullYear(), { message: "Publication year cannot be in the future" }),

    book_aliases: bookModel.shape.book_aliases.optional(),
});

export const createBookSchema = z.object({
    book: createBookBase,
    genre_ids: z.array(genreModel.shape.genre_id).optional(),
    image: z.file().optional()
});

export const updateBookSchema = createBookSchema.extend({
    book: createBookSchema.shape.book.partial(),
}).partial();

export type BookCreate = z.infer<typeof createBookSchema>;
export type BookUpdate = z.infer<typeof updateBookSchema>;