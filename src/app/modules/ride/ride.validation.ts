import z from "zod";
import { RideStatus } from "./ride.interface";

export const locationSchema = z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
});

export const createRidesZodSchema = z.object({
    pickupLocation: locationSchema,
    destinationLocation: locationSchema,
})