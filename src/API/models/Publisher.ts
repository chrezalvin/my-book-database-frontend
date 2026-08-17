import {z} from "zod";

export const publisherModel = z.object({
    publisher_id: z.uuid(),
    created_at: z.string(),
    publisher_name: z.string(),
    publisher_description: z.string().nullable(),
    publisher_img: z.string().nullable(),
    publisher_aliases: z.array(z.string()),
});

export type Publisher = z.infer<typeof publisherModel>;