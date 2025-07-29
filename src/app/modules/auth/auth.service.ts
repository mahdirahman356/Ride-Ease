import { Response } from "express";
import AppError from "../../errorHelpers/AppError";
import { createToken } from "../../utils/createTokens";
import { setAuthCookie } from "../../utils/setCookie";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs"


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

export const AuthServices = {
    credentialsLogin
}