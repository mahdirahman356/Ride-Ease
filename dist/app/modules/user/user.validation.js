"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: zod_1.default
        .string()
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role))
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    isOnline: zod_1.default
        .boolean().optional(),
    isApproved: zod_1.default
        .boolean().optional(),
    vehicleInfo: zod_1.default
        .object({
        model: zod_1.default.string(),
        plateNumber: zod_1.default.string(),
    })
        .optional()
});
