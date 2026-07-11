import { z } from "zod";
import { genreModel } from "../models/Genre";

export const createGenreSchema = genreModel.omit({
    genre_id: true,
    genre_img: true,
}).extend({
    genre_name: genreModel.shape.genre_name.trim().min(1, { message: "Genre name is required" }),
    genre_description: genreModel.shape.genre_description.optional().nullable(),
})

export const updateGenreSchema = createGenreSchema.partial();

export type GenreCreate = z.infer<typeof createGenreSchema>;
export type GenreUpdate = z.infer<typeof updateGenreSchema>;