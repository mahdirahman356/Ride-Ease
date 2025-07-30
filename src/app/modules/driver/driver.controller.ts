import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"
import { DriverServices } from "./driver.service"

const approveDriver  = catchAsync(async (req: Request, res: Response, next: NextFunction ) => {
    const {status} = req.body
    const decodedToken = req.user as JwtPayload
    const rideId = req.params.id
    const rideRequest = await DriverServices.approveDriver(status, decodedToken.userId, rideId)
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Ride status updated successfully",
        data: rideRequest
    })

})

export const DriverControllers = {
    approveDriver 
}