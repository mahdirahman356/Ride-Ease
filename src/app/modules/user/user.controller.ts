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
    const query = req.query
    const result = await UserServices.viewAllTypeOfUsers(query as Record<string, string>)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Successfully retrieved all users`,
        data: result
    })

})

const viewAllrides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await UserServices.viewAllrides(query as Record<string, string>)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Successfully retrieved all rides`,
        data: result
    })

})

const adminAnalytics  = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.adminAnalytics()
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Successfully retrieved all Analytics`,
        data: result
    })

})

const getMe = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
      const decodedToken = req.user as JwtPayload
      const result = await UserServices.getMe(decodedToken.userId)
      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Your Profile Retrieved Successfully",
        data: result.data
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const userId = req.params.id 
    const verifiedToken = req.user
    const payload = req.body

    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Updated Successfully",
        data: user
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
    viewAllrides,
    adminAnalytics,
    getMe,
    updateUser,
    updateDriverApproval,
    setUserActiveStatus
}