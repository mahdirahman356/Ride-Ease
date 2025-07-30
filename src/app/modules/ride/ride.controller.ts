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
    console.log(decodedToken?.userId)
    const user = await RideServices.getMyRideRequest(decodedToken.userId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rides retrieved successfully",
        data: user
    })

})

const rideStatusUpdate = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const rideId = req.params.id
    const { status } = req.body
    const user = await RideServices.rideStatusUpdate(status, decodedToken.userId, rideId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Ride status updated successfully",
        data: user
    })

})

export const RideController = {
    rideRequest,
    getMyRideRequest,
    rideStatusUpdate
}