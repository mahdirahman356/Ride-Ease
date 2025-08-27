import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
       
     const user = await AuthServices.credentialsLogin(req.body, res)
     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "User Logged In Successfully",
            data: user
        })
        
}) 
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
     
      res.clearCookie("accessToken", {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
      })

     sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "User Logged out Successfully",
            data: null
        })
        
}) 

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User Changed Successfully",
        data: null
    })
})


export const AuthControllers = {
    credentialsLogin,
    logout,
    changePassword
}