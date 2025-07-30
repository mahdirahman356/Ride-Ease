import AppError from "../../errorHelpers/AppError";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";


const approveDriver = async (status: RideStatus, driverId: string, rideId: string) => {

    const driver = await User.findById(driverId);

    if (!driver) {
        throw new AppError(400, `Driver not found`);
    }

    if (driver.isActive === IsActive.BLOCKED || driver.isActive === IsActive.INACTIVE) {
        throw new AppError(400, `Your account is ${driver.isActive.toLowerCase()}`);
    }

    if (driver.isDeleted) {
        throw new AppError(400, "Your account has been deleted");
    }

    if (!driver.isOnline) {
        throw new AppError(403, "Driver is currently offline");
    }

    if (!driver.isApproved) {
        throw new AppError(403, "Driver is not approved by admin");
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

    console.log(ride)

    const updateStatus = await Ride.findByIdAndUpdate(
        ride._id,
        { status: status, driver: driver._id },
        { new: true, runValidators: true })

    return updateStatus
};


export const DriverServices = {
    approveDriver
}