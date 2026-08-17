import { z } from "zod";
import { genreModel } from "../models/Genre";

const createGenreBase = genreModel.omit({
    genre_id: true,
    genre_img: true,
}).extend({
    genre_name: genreModel.shape.genre_name.trim().min(1, { message: "Genre name is required" }),
    genre_description: genreModel.shape.genre_description.optional().nullable(),
    genre_aliases: genreModel.shape.genre_aliases.optional(),
});

export const createGenreSchema = z.object({
    genre: createGenreBase,
    image: z.file().optional()
})

export const updateGenreSchema = createGenreSchema.extend({
    genre: createGenreSchema.shape.genre.partial(),
}).partial();

export type GenreCreate = z.infer<typeof createGenreSchema>;
export type GenreUpdate = z.infer<typeof updateGenreSchema>;