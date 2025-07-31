"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
const handlerZodError = (err) => {
    const errorSources = [];
    err.issues.forEach((issues) => errorSources.push({
        path: issues.path[issues.path.length - 1],
        message: issues.message
    }));
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handlerZodError = handlerZodError;
