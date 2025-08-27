import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"
import { DriverServices } from "./driver.service"

const driverRideAssign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body
    const decodedToken = req.user as JwtPayload
    const rideId = req.params.id
    await DriverServices.driverRideAssign(status, decodedToken.userId, rideId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `Ride status has been updated to '${status}'.`,
        data: null
    })

})

const getMyRideHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const query = req.query
    console.log(decodedToken?.userId)
    const result = await DriverServices.getMyRideHistory(query as Record<string, string>, decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rides retrieved successfully",
        data: result
    })

})
const rideRequests = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await DriverServices.rideRequests(decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Ride Requests retrieved successfully",
        data: result
    })

})
const getMyEarnings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const query = req.query
    const result = await DriverServices.getMyEarnings(decodedToken.userId, query as Record<string, string>)
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
    driverRideAssign,
    getMyRideHistory,
    getMyEarnings,
    rideRequests,
    getDriverAssignedRides
}