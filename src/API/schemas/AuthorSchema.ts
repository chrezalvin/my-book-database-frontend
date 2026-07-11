import { z } from "zod";
import { authorModel } from "../models/Author";

export const createAuthorSchema = authorModel.omit({
    author_img: true,
    created_at: true,
    author_id: true,
}).extend({
    author_name: authorModel.shape.author_name.trim().min(1, { message: "Author name is required" }),
    author_description: authorModel.shape.author_description.optional().nullable(),
})

export const updateAuthorSchema = createAuthorSchema.partial();

export type AuthorCreate = z.infer<typeof createAuthorSchema>;
export type AuthorUpdate = z.infer<typeof updateAuthorSchema>;