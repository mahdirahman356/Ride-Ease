import { Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { createToken } from "../../utils/createTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const credentialsLogin = async (payload: Partial<IUser>, res: Response<any, Record<string, any>>) => {
    const { email, password } = payload
    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(400, "Email does not exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password)

    if (!isPasswordMatched) {
        throw new AppError(400, "Incorrect Password")
    }

    const userToken = createToken(isUserExist);
    setAuthCookie(res, userToken); 

     const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userToken.accessToken,
        user: rest
    }


}

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(401, "Old Password does not match");
    }

    if (oldPassword === newPassword) {
        throw new AppError(400, "New password must be different from the old password");

    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();


}


export const AuthServices = {
    credentialsLogin,
    changePassword
}