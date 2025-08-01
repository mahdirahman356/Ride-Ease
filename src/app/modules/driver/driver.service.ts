import { Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";


const driverRideAssign = async (status: RideStatus, driverId: string, rideId: string) => {

    const driver = await User.findById(driverId);

    if (!driver) {
        throw new AppError(400, `Driver not found`);
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
const getMyEarnings = async (userId: string) => {
    const completedRides = await Ride.find({ driver: userId, status: "COMPLETED" })
    if (!completedRides || completedRides.length === 0) {
        return {
            message: "No completed rides found in your history.",
        };
    }
    return completedRides
}
const getDriverAssignedRides = async (userId: string) => {

    const validStatuses: RideStatus[] = [ RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT];
    const ride = await Ride.find({ driver: userId, status: { $in: validStatuses } })

    if (!ride || ride.length === 0) {
        return {
            message: "No assigned ride found for the driver.",
        };
    }
    return ride
}

export const DriverServices = {
    driverRideAssign,
    getMyEarnings,
    getDriverAssignedRides
}