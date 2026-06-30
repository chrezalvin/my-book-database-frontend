import { z } from "zod";
import { authorModel } from "./Author";
import { publisherModel } from "./Publisher";

export const bookModel = z.object({
    book_id: z.uuid(),
    created_at: z.string(),
    title: z.string(),
    publication_year: z.number().int(),
    language: z.string(),
    summary: z.string(),
    cover_img: z.string().nullable(),
    isbn: z.string().nullable(),
    edition: z.string().nullable(),

    author_id: authorModel.shape.author_id.nullable(), 
    author_name: authorModel.shape.author_name.nullable(),

    publisher_id: publisherModel.shape.publisher_id.nullable(),
    publisher_name: publisherModel.shape.publisher_name.nullable(),

    genres: z.array(
        z.object({
            genre_id: z.uuid(),
            genre_name: z.string(),
        })
    ).nullable(),
})

export type Book = z.infer<typeof bookModel>;