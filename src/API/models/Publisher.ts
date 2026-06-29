import {z} from "zod";

export const publisherModel = z.object({
    publisher_id: z.uuid(),
    created_at: z.string(),
    publisher_name: z.string(),
    publisher_description: z.string().nullable(),
});

export const publisherCreate = publisherModel.omit({
    publisher_id: true,
    created_at: true,
});

export const publisherUpdate = publisherCreate.partial();

export type Publisher = z.infer<typeof publisherModel>;
export type PublisherCreate = z.infer<typeof publisherCreate>;
export type PublisherUpdate = z.infer<typeof publisherUpdate>;