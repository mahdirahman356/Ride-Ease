import z, { email } from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z
        .string()
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    phone: z
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    isOnline: z
        .boolean().optional(),
    isApproved: z
        .boolean().optional(),
    vehicleInfo: z
    .object({
      model: z.string(),
      plateNumber: z.string(),
    })
    .optional()    
})