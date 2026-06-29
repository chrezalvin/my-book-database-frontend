import {z} from "zod";

export const authorModel = z.object({
    author_id: z.uuid(),
    created_at: z.string(),
    author_name: z.string(),
    author_description: z.string().nullable(),
});

export const authorCreate = authorModel.omit({
    author_id: true,
    created_at: true,
});

export const authorUpdate = authorCreate.partial();

export type Author = z.infer<typeof authorModel>;
export type AuthorCreate = z.infer<typeof authorCreate>;
export type AuthorUpdate = z.infer<typeof authorUpdate>;