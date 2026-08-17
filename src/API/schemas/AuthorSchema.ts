import { z } from "zod";
import { authorModel } from "../models/Author";

const createAuthorBase = authorModel.omit({
    author_img: true,
    created_at: true,
    author_id: true,
}).extend({
    author_name: authorModel.shape.author_name.trim().min(1, { message: "Author name is required" }),
    author_description: authorModel.shape.author_description.optional().nullable(),
    author_aliases: authorModel.shape.author_aliases.optional(),
});

export const createAuthorSchema = z.object({
    author: createAuthorBase,
    image: z.file().optional()
})

export const updateAuthorSchema = createAuthorSchema.extend({
    author: createAuthorSchema.shape.author.partial(),
}).partial();

export type AuthorCreate = z.infer<typeof createAuthorSchema>;
export type AuthorUpdate = z.infer<typeof updateAuthorSchema>;