import { JwtPayload } from "jsonwebtoken";
import { userSearchableFilds } from "../../../constants";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Ride } from "../ride/ride.model";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
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

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password")
    return {
        data: user
    }
}

const viewAllTypeOfUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find({ role: { $ne: "ADMIN" } }, "-password"), query)

    console.log(query)

    const user = await queryBuilder
        .filter()
        .search(userSearchableFilds)
        .fields()
        .build()

    return user

}

const viewAllrides = async (query: Record<string, string>) => {

    const rides = Ride.find()
        .populate("rider", "name phone role")
        .populate("driver", "name phone role")

    const queryBuilder = new QueryBuilder(rides, query)

    const user = await queryBuilder
        .filter()
        .build()

    return user

}
const adminAnalytics = async () => {

    const analyticsData = await Ride.aggregate([
        {
            $match: {
                status: 'COMPLETED',
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$statusHistory.completedAt" }
                },
                rides: { $sum: 1 },
                revenue: { $sum: "$fareEstimation" }
            }
        },
        { $sort: { "_id": 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                rides: 1,
                revenue: 1
            }
        }
    ]);

    const driverActivity = await Ride.aggregate([
        { $match: { status: "COMPLETED" } },

        {
            $group: {
                _id: "$driver",
                totalRides: { $sum: 1 },
                totalRevenue: { $sum: "$fareEstimation" },
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "driverInfo"
            }
        },

        {
            $unwind: "$driverInfo"
        },

        {
            $project: {
                _id: 0,
                driverId: "$_id",
                name: "$driverInfo.name",
                email: "$driverInfo.email",
                phone: "$driverInfo.phone",
                address: "$driverInfo.address",
                isActive: "$driverInfo.isActive",
                totalRides: 1,
                totalRevenue: 1
            }
        },

        { $sort: { totalRides: -1 } }
    ]);



    return {
        analyticsData,
        driverActivity
    };

}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (userId !== decodedToken.userId) {
        throw new AppError(401, "You are not authorized")
    }

    const ifUserExist = await User.findById(userId)

    if (!ifUserExist) {
        throw new AppError(404, "User Not Found")
    }

    if (ifUserExist.isActive === IsActive.BLOCKED) {
        throw new AppError(401, "This user can not be updated")
    }

    if (decodedToken.role === Role.DRIVER) {
        if (ifUserExist.isApproved === false) {
            throw new AppError(401, "This user can not be updated")
        }
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    return newUpdatedUser
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

    if (!Object.values(IsActive).includes(isActive)) {
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
    viewAllrides,
    adminAnalytics,
    getMe,
    updateUser,
    updateDriverApproval,
    setUserActiveStatus
}