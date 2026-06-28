import { z } from "zod";

export const bookModel = z.object({
    book_id: z.uuid(),
    created_at: z.string(),
    title: z.string(),
    author: z.string(),
    publisher: z.string(),
    publication_year: z.number().int(),
    language: z.string(),
    summary: z.string(),
    cover_img: z.string().nullable(),
    isbn: z.string().nullable(),
    edition: z.string().nullable(),
    genres: z.array(
        z.object({
            genre_id: z.uuid(),
            genre_name: z.string(),
        })
    ).nullable(),
})

export type Book = z.infer<typeof bookModel>;