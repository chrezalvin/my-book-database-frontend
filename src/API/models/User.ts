import z from "zod";

export const userModel = z.object({
    user_id: z.string(),
    email: z.string(),

});

export type User = z.infer<typeof userModel>;