import z from "zod";

export const jwtModel = z.object({
    user_id: z.uuid(),
    email: z.string(),
    iat: z.number(),
    exp: z.number(),
});

export type Jwt = z.infer<typeof jwtModel>;