import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { Ride } from "../ride/ride.model";
import { IAuthProvider, IsActive, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, isOnline, ...rest } = payload
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(400, "User Already Exist")
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

    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(404, "User Not Found")
    }

    user.isOnline = isOnline
    await user.save()

}

const viewAllTypeOfUsers = async (type: string) => {

    if (!type) {
        throw new AppError(400, "Query parameter 'type' is required (user | driver | ride)")
    }

    let data;
    if (type === "user") {
        data = await User.find({ role: { $ne: "ADMIN" } }, "-password")
    }
    if (type === "driver") {
        data = await User.find({ role: "DRIVER" }, "-password");
    }
    if (type === "ride") {
        data = await Ride.find()
            .populate("rider", "name phone")
            .populate("driver", "name phone")
    }

    return data

}
const updateDriverApproval = async (isApproved: boolean, driverId: string) => {

    const driver = await User.findById(driverId)

    if (!driver || driver.role !== "DRIVER") {
        throw new AppError(404, "Driver not found")
    }

    driver.isApproved = isApproved;
    await driver.save();

}
const setUserActiveStatus = async (isActive: IsActive, userId: string) => {

    if(!Object.values(IsActive).includes(isActive)){
        throw new AppError(400, `Invalid isActive status. Valid values are: ${Object.values(IsActive).join(", ")}`)
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(404, "User not found")
    }

    user.isActive = isActive;
    await user.save();
}

export const UserServices = {
    createUser,
    updateAvailability,
    viewAllTypeOfUsers,
    updateDriverApproval,
    setUserActiveStatus
}