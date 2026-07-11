import { z } from "zod";

export const genreModel = z.object({
    genre_id: z.uuid(),
    genre_name: z.string(),
    genre_description: z.string().nullable(),
    genre_img: z.string().nullable(),
});

export type Genre = z.infer<typeof genreModel>;