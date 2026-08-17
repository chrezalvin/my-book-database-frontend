import { z } from "zod";
import { authorModel } from "./Author";
import { publisherModel } from "./Publisher";
import { genreModel } from "./Genre";

export const bookModel = z.object({
    book_id: z.uuid(),
    title: z.string(),
    summary: z.string(),
    cover_img: z.string().nullable(),
    created_at: z.string(),
    publication_year: z.number().int(),
    language: z.string(),
    isbn: z.string().nullable(),
    edition: z.string().nullable(),
    book_aliases: z.array(z.string()),

    author_id: authorModel.shape.author_id.nullable(), 
    publisher_id: publisherModel.shape.publisher_id.nullable(),

    author: z.object({
        author_id: authorModel.shape.author_id,
        author_img: authorModel.shape.author_img,
        author_name: authorModel.shape.author_name
    }).nullable(),

    publisher: z.object({
        publisher_id: publisherModel.shape.publisher_id,
        publisher_img: publisherModel.shape.publisher_img,
        publisher_name: publisherModel.shape.publisher_name,
    }).nullable(),

    genres: z.array(
        z.object({
            genre_id: genreModel.shape.genre_id,
            genre_img: genreModel.shape.genre_img,
            genre_name: genreModel.shape.genre_name,
        })
    ),
})

export type Book = z.infer<typeof bookModel>;