import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { IRide, RideStatus } from "./ride.interface"
import { Ride } from "./ride.model"

const MAX_CANCELS_PER_DAY = 3

const rideRequest = async (payload: Partial<IRide>, userId: string) => {

    const existingActiveRide = await Ride.findOne({
        rider: userId,
        status: { $in: [RideStatus.REQUESTED, RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT] },
    });

    if (existingActiveRide) {
        throw new AppError(400, "You already have an active ride.");
    }


    const availableDrivers = await User.find({
        role: "DRIVER",
        isOnline: true,
        isApproved: true,
        isDeleted: false,
        isActive: "ACTIVE",
    });

    if (!availableDrivers.length) {
        throw new AppError(404, "No available drivers right now.")
    }

    const rideRequest = await Ride.create({
        rider: userId,
        ...payload
    })
    return rideRequest
}
const getMyRideRequest = async (userId: string) => {
    console.log(userId)
    const myRides = await Ride.find({ rider: userId })
    if (!myRides || myRides.length === 0) {
        return {
            message: "No rides found in your history.",
        };
    }
    return myRides
}
const rideStatusUpdate = async (status: string, userId: string, rideId: string) => {

    const ride = await Ride.findById(rideId)
    if (!ride) {
        throw new AppError(404, "Ride not found");
    }

    if (status !== RideStatus.CANCELLED) {
        throw new AppError(400, "Invalid ride status.");
    }

    if (ride.rider.toString() !== userId) {
        throw new AppError(403, "You are not allowed to update this ride");
    }

    if (ride.status !== RideStatus.REQUESTED) {
        throw new AppError(400, `Ride cannot be cancelled because it is already ${ride.status.toLowerCase().replace('_', ' ')}.`);
    }

    const rider = await User.findById(userId)

    if (!rider) {
        throw new AppError(404, "Rider not found");
    }

    const now = new Date();

    if (rider.lastCancelAt && now.getTime() - rider.lastCancelAt.getTime() > 24 * 60 * 60 * 1000) {
        rider.cancelAttempts = 0;
    }

    if (rider.cancelAttempts >= MAX_CANCELS_PER_DAY) {
        throw new AppError(403, "You have reached the maximum number of ride cancellations allowed today.");
    }


    ride.status = status;
    ride.statusHistory.cancelledAt = now

    rider.cancelAttempts = (rider.cancelAttempts || 0) + 1;
    rider.lastCancelAt = now;

    await Promise.all([ride.save(), rider.save()]);

}

export const RideServices = {
    rideRequest,
    getMyRideRequest,
    rideStatusUpdate
}