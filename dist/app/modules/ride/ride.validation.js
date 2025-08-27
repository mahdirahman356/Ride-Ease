"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRidesZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createRidesZodSchema = zod_1.default.object({
    pickupLocation: zod_1.default.string(),
    destinationLocation: zod_1.default.string(),
    fareEstimation: zod_1.default.number(),
    paymentMethod: zod_1.default.string()
});
