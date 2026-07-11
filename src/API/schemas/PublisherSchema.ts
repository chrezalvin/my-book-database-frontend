import { z } from "zod";
import { publisherModel } from "../models/Publisher";

export const createPublisherSchema = publisherModel.omit({
    created_at: true,
    publisher_id: true,
    publisher_img: true,
}).extend({
    publisher_name: publisherModel.shape.publisher_name.trim().min(1, { message: "Publisher name is required" }),
    publisher_description: publisherModel.shape.publisher_description.optional().nullable(),
})

export const updatePublisherSchema = createPublisherSchema.partial();

export type PublisherCreate = z.infer<typeof createPublisherSchema>;
export type PublisherUpdate = z.infer<typeof updatePublisherSchema>;