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
    const { isOnline } = req.body
    await UserServices.updateAvailability(isOnline, decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Availability status updated to ${isOnline ? "Online" : "Offline"}.`,
        data: null
    })

})
const viewAllTypeOfUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query as Record<string, string>
    const result = await UserServices.viewAllTypeOfUsers(type)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Successfully retrieved all ${type}s.`,
        data: result
    })

})
const updateDriverApproval = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { isApproved } = req.body
    const driverId = req.params.id
    await UserServices.updateDriverApproval(isApproved, driverId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Driver has been ${isApproved ? "approved" : "suspended"}`,
        data: null
    })

})
const setUserActiveStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { isActive } = req.body
    const userId = req.params.id
    await UserServices.setUserActiveStatus(isActive, userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `User has been ${isActive.toLowerCase()}`,
        data: null
    })

})

export const UserController = {
    createUser,
    updateAvailability,
    viewAllTypeOfUsers,
    updateDriverApproval,
    setUserActiveStatus
}