import mongoose, { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { rideSearchableFilds } from "../../../constants";


const driverRideAssign = async (status: RideStatus, driverId: string, rideId: string) => {

    const driver = await User.findById(driverId);

    if (!driver) {
        throw new AppError(400, `Driver not found`);
    }

    if (!driver.isOnline) {
        throw new AppError(403, "Driver is currently offline");
    }

    if (!driver.isApproved) {
        throw new AppError(403, "Driver is not approved by admin");
    }

    if (driver.isActive === IsActive.BLOCKED || driver.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${driver.isActive}`)
    }


    const cleanedRideId = rideId.trim();
    const ride = await Ride.findById(cleanedRideId);

    if (!ride) {
        throw new AppError(404, "Ride request not found");
    }

    if (ride.status === RideStatus.CANCELLED || ride.status === RideStatus.REJECTED) {
        throw new AppError(400, `Ride is ${ride.status}`);
    }

    if (ride.status !== RideStatus.REQUESTED && ride.driver.toString() !== driverId) {
        throw new AppError(400, "Ride is no longer available");
    }

    const ongoingRide = await Ride.findOne({
        driver: driverId,
        status: { $in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
    });


    if (ongoingRide && ongoingRide._id.toString() !== ride._id.toString()) {
        throw new AppError(403, "You already have an active ride");
    }

    const validTransitions: Record<RideStatus, RideStatus[]> = {
        [RideStatus.REQUESTED]: [RideStatus.ACCEPTED, RideStatus.REJECTED],
        [RideStatus.ACCEPTED]: [RideStatus.PICKED_UP],
        [RideStatus.PICKED_UP]: [RideStatus.IN_TRANSIT],
        [RideStatus.IN_TRANSIT]: [RideStatus.COMPLETED],
        [RideStatus.COMPLETED]: [],
        [RideStatus.CANCELLED]: [],
        [RideStatus.REJECTED]: [],
    };

    if (!validTransitions[ride.status].includes(status)) {
        throw new AppError(400, `Invalid status transition from ${ride.status} to ${status}`);

    }

    const now = new Date()

    ride.driver = new Types.ObjectId(driverId);
    ride.status = status
    switch (status) {
        case RideStatus.ACCEPTED:
            ride.statusHistory.acceptedAt = now;
            break;
        case RideStatus.PICKED_UP:
            ride.statusHistory.pickedUpAt = now;
            break;
        case RideStatus.IN_TRANSIT:
            ride.statusHistory.inTransitAt = now;
            break;
        case RideStatus.COMPLETED:
            ride.statusHistory.completedAt = now;
            break;
        case RideStatus.REJECTED:
            ride.statusHistory.rejectedAt = now;
            break;
        default:
            break;
    }

    await ride.save({ validateBeforeSave: true });
};

const getMyRideHistory = async (query: Record<string, string>, userId: string) => {

    const driver = await User.findById(userId);

    if (!driver) {
        throw new AppError(400, `Driver not found`);
    }

    if (!driver.isApproved) {
        throw new AppError(403, "Driver is not approved by admin");
    }

    if (driver.isActive === IsActive.BLOCKED || driver.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${driver.isActive}`)
    }

    const myRides = Ride.find({ driver: userId })
        .populate("rider", "name phone role")
    const queryBuilder = new QueryBuilder(myRides, query)

    const rides = queryBuilder
        .filter()
        .search(rideSearchableFilds)
        .sort()
        .filter()
        .paginate()

    const [data, meta] = await Promise.all([
        rides.build(),
        queryBuilder.getMeta({ driver: userId })
    ])

    return {
        data,
        meta
    }
}
const rideRequests = async (userId: string) => {
    const driver = await User.findById(userId);

    if (!driver) {
        throw new AppError(400, `Driver not found`);
    }

    if (!driver.isApproved) {
        throw new AppError(403, "Driver is not approved by admin");
    }

    if (driver.isActive === IsActive.BLOCKED || driver.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${driver.isActive}`)
    }

    const rideRequests = await Ride.find({ status: "REQUESTED" })
        .populate("rider", "name address")

    if (!rideRequests || rideRequests.length === 0) {
        return {
            message: "No requests found",
        };
    }
    return rideRequests
}

const getMyEarnings = async (userId: string, query: Record<string, string>) => {
    const driver = await User.findById(userId);

    const { filter } = query;

    if (!driver) {
        throw new AppError(400, `Driver not found`);
    }

    if (!driver.isApproved) {
        throw new AppError(403, "Driver is not approved by admin");
    }

    if (driver.isActive === IsActive.BLOCKED || driver.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${driver.isActive}`);
    }

    let groupFormat;
    let projectFormat;

    switch (filter) {
        case 'daily':
            groupFormat = {
                $dateToString: { format: '%Y-%m-%d', date: '$statusHistory.completedAt' },
            };
            projectFormat = { label: '$_id', earnings: '$totalEarnings' };
            break;
        case 'monthly':
            groupFormat = {
                $dateToString: { format: '%Y-%m', date: '$statusHistory.completedAt' },
            };
            projectFormat = { label: '$_id', earnings: '$totalEarnings' };
            break;
        default:
            return { message: 'Invalid time range specified' };
    }

    const driverObjectId = new mongoose.Types.ObjectId(userId);
    const earningsData = await Ride.aggregate([
        {
            $match: {
                driver: driverObjectId,
                status: 'COMPLETED',
            },
        },
        {
            $group: {
                _id: groupFormat,
                totalEarnings: { $sum: '$fareEstimation' },
            },
        },
        {
            $sort: { _id: 1 },
        },
        {
            $project: projectFormat,
        },
    ]);

    return earningsData;
};

const getDriverAssignedRides = async (userId: string) => {

    const driver = await User.findById(userId);

    if (!driver) {
        throw new AppError(400, `Driver not found`);
    }

    if (!driver.isOnline) {
        throw new AppError(403, "Driver is currently offline");
    }

    if (!driver.isApproved) {
        throw new AppError(403, "Driver is not approved by admin");
    }

    if (driver.isActive === IsActive.BLOCKED || driver.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `User is ${driver.isActive}`)
    }


    const validStatuses: RideStatus[] = [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT];
    const ride = await Ride.find({ driver: userId, status: { $in: validStatuses } })
        .populate("rider", "name address")

    if (!ride || ride.length === 0) {
        return {
            message: "No assigned ride found for the driver.",
        };
    }
    return ride
}

export const DriverServices = {
    driverRideAssign,
    getMyRideHistory,
    getMyEarnings,
    rideRequests,
    getDriverAssignedRides
}