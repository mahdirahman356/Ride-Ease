import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"
import { DriverServices } from "./driver.service"

const approveDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body
    const decodedToken = req.user as JwtPayload
    const rideId = req.params.id
    await DriverServices.approveDriver(status, decodedToken.userId, rideId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Ride status has been updated to '${status}'.`,
        data: null
    })

})

const getMyEarnings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverServices.getMyEarnings(decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Earnings history retrieved successfully",
        data: result
    })

})
const getDriverAssignedRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverServices.getDriverAssignedRides(decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Assigned ride retrieved successfully",
        data: result
    })

})

export const DriverControllers = {
    approveDriver,
    getMyEarnings,
    getDriverAssignedRides
}