/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"

export const handlerZodError = (err: any): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = []
    err.issues.forEach((issues: any) => errorSources.push({
        path: issues.path[issues.path.length - 1],
        message: issues.message
    }))

    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }
}
