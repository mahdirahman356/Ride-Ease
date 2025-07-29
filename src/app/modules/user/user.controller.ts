import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
      console.log("body",req.body)
      const user = await UserServices.createUser(req.body)
     sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Created Successfully",
        data: user
    })
    
})

export const UserController = {
    createUser
}