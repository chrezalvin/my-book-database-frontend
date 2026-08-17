import {z} from "zod";

export const authorModel = z.object({
    author_id: z.uuid(),
    created_at: z.string(),
    author_name: z.string(),
    author_description: z.string().nullable(),
    author_img: z.url().nullable(),
    author_aliases: z.array(z.string()),
});

export type Author = z.infer<typeof authorModel>;