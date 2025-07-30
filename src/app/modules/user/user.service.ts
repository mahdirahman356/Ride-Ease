import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, isOnline, ...rest } = payload
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(400, "User Already Exist")
    }

    if (role !== "DRIVER" && isOnline !== undefined) {
        throw new AppError(400, "isOnline is only allowed when role is DRIVER");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const userData: Partial<IUser> & { isOnline?: boolean } = {
        email,
        password: hashedPassword,
        role,
        auths: [authProvider],
        ...rest
    }

    if (role === "DRIVER") {
        userData.isApproved = false;
        userData.isOnline = isOnline ?? false;
        userData.vehicleInfo = payload.vehicleInfo ?? null; 
    }


    const user = await User.create(userData)

    return user
}
const updateAvailability = async (isOnline: boolean, userId: string) => {

    const updateAvailability = User.findByIdAndUpdate(
        userId,
        { isOnline },
        { new: true, runValidators: true })

    if (!updateAvailability) {
        throw new AppError(404, "User Not Found")
    }

    return updateAvailability

}

export const UserServices = {
    createUser,
    updateAvailability
}