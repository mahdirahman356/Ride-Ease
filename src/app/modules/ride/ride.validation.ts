import z from "zod";

export const createRidesZodSchema = z.object({
    pickupLocation: z.string(),
    destinationLocation: z.string(),
    fareEstimation: z.number(),
    paymentMethod: z.string()
})