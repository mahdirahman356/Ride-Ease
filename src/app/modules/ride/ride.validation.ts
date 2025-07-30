import z from "zod";
import { RideStatus } from "./ride.interface";


export const createRidesZodSchema = z.object({
    pickupLocation: z.string(),
    destinationLocation: z.string(),
    status: z.enum(Object.values(RideStatus) as [string]).optional()
})