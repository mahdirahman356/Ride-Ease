"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRidesZodSchema = exports.locationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.locationSchema = zod_1.default.object({
    lat: zod_1.default.number(),
    lng: zod_1.default.number(),
    address: zod_1.default.string().optional(),
});
exports.createRidesZodSchema = zod_1.default.object({
    pickupLocation: exports.locationSchema,
    destinationLocation: exports.locationSchema,
});
