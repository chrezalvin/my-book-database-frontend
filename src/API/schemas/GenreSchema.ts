import { z } from "zod";
import { genreModel } from "../models/Genre";

export const createGenreSchema = genreModel.omit({
    genre_id: true,
})

export const updateGenreSchema = createGenreSchema;

export type CreateGenre = z.infer<typeof createGenreSchema>;
export type UpdateGenre = z.infer<typeof updateGenreSchema>;