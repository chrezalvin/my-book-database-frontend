import { z } from "zod";

export const genreModel = z.object({
    genre_id: z.uuid(),
    genre_name: z.string(),
});

export type Genre = z.infer<typeof genreModel>;