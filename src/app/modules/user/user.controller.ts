import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Created Successfully",
        data: user
    })

})
const updateAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const {isOnline} = req.body
    const result = await UserServices.updateAvailability(isOnline, decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Availability Updated Successfully",
        data: result
    })

})

export const UserController = {
    createUser,
    updateAvailability
}