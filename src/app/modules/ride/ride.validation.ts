import z from "zod";

export const createRidesZodSchema = z.object({
    pickupLocation: z.object({
        address: z.string(),
        latitude: z.number(),
        longitude: z.number()
    }),
    destinationLocation: z.object( {
        address: z.string(),
        latitude: z.number(),
        longitude: z.number()
    }),
    fareEstimation: z.number(),
    paymentMethod: z.string()
})