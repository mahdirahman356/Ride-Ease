import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { RideServices } from "./ride.service";

const rideRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const rideRequest = await RideServices.rideRequest(req.body, decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Ride request sent. Waiting for driver to accept",
        data: rideRequest
    })

})

const getMyRideRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const query = req.query
    console.log(decodedToken?.userId)
    const result = await RideServices.getMyRideRequest(query as Record<string, string>, decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rides retrieved successfully",
        data: result
    })

})

const rideStatusUpdate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const rideId = req.params.id
    const { status } = req.body
    await RideServices.rideStatusUpdate(status, decodedToken.userId, rideId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: `You have Cancelled the ride`,
        data: null
    })

})

export const RideController = {
    rideRequest,
    getMyRideRequest,
    rideStatusUpdate
}