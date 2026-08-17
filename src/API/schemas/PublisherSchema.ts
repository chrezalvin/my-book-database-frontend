import { z } from "zod";
import { publisherModel } from "../models/Publisher";

const createPublisherBase = publisherModel.omit({
    created_at: true,
    publisher_id: true,
    publisher_img: true,
}).extend({
    publisher_name: publisherModel.shape.publisher_name.trim().min(1, { message: "Publisher name is required" }),
    publisher_description: publisherModel.shape.publisher_description.optional().nullable(),
    publisher_aliases: publisherModel.shape.publisher_aliases.optional(),
});

export const createPublisherSchema = z.object({
    publisher: createPublisherBase,
    image: z.file().optional()
})

export const updatePublisherSchema = createPublisherSchema.extend({
    publisher: createPublisherSchema.shape.publisher.partial(),
}).partial();

export type PublisherCreate = z.infer<typeof createPublisherSchema>;
export type PublisherUpdate = z.infer<typeof updatePublisherSchema>;