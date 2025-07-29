import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";


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

export const AuthControllers = {
    credentialsLogin,
    logout
}