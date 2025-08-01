"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const driverRideAssign = (status, driverId, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(400, `Driver not found`);
    }
    const cleanedRideId = rideId.trim();
    const ride = yield ride_model_1.Ride.findById(cleanedRideId);
    if (!ride) {
        throw new AppError_1.default(404, "Ride request not found");
    }
    if (ride.status === ride_interface_1.RideStatus.CANCELLED || ride.status === ride_interface_1.RideStatus.REJECTED) {
        throw new AppError_1.default(400, `Ride is ${ride.status}`);
    }
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED && ride.driver.toString() !== driverId) {
        throw new AppError_1.default(400, "Ride is no longer available");
    }
    const ongoingRide = yield ride_model_1.Ride.findOne({
        driver: driverId,
        status: { $in: ["ACCEPTED", "PICKED_UP", "IN_TRANSIT"] },
    });
    if (ongoingRide && ongoingRide._id.toString() !== ride._id.toString()) {
        throw new AppError_1.default(403, "You already have an active ride");
    }
    const validTransitions = {
        [ride_interface_1.RideStatus.REQUESTED]: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.REJECTED],
        [ride_interface_1.RideStatus.ACCEPTED]: [ride_interface_1.RideStatus.PICKED_UP],
        [ride_interface_1.RideStatus.PICKED_UP]: [ride_interface_1.RideStatus.IN_TRANSIT],
        [ride_interface_1.RideStatus.IN_TRANSIT]: [ride_interface_1.RideStatus.COMPLETED],
        [ride_interface_1.RideStatus.COMPLETED]: [],
        [ride_interface_1.RideStatus.CANCELLED]: [],
        [ride_interface_1.RideStatus.REJECTED]: [],
    };
    if (!validTransitions[ride.status].includes(status)) {
        throw new AppError_1.default(400, `Invalid status transition from ${ride.status} to ${status}`);
    }
    const now = new Date();
    ride.driver = new mongoose_1.Types.ObjectId(driverId);
    ride.status = status;
    switch (status) {
        case ride_interface_1.RideStatus.ACCEPTED:
            ride.statusHistory.acceptedAt = now;
            break;
        case ride_interface_1.RideStatus.PICKED_UP:
            ride.statusHistory.pickedUpAt = now;
            break;
        case ride_interface_1.RideStatus.IN_TRANSIT:
            ride.statusHistory.inTransitAt = now;
            break;
        case ride_interface_1.RideStatus.COMPLETED:
            ride.statusHistory.completedAt = now;
            break;
        case ride_interface_1.RideStatus.REJECTED:
            ride.statusHistory.rejectedAt = now;
            break;
        default:
            break;
    }
    yield ride.save({ validateBeforeSave: true });
});
const getMyEarnings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const completedRides = yield ride_model_1.Ride.find({ driver: userId, status: "COMPLETED" });
    if (!completedRides || completedRides.length === 0) {
        return {
            message: "No completed rides found in your history.",
        };
    }
    return completedRides;
});
const getDriverAssignedRides = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT];
    const ride = yield ride_model_1.Ride.find({ driver: userId, status: { $in: validStatuses } });
    if (!ride || ride.length === 0) {
        return {
            message: "No assigned ride found for the driver.",
        };
    }
    return ride;
});
exports.DriverServices = {
    driverRideAssign,
    getMyEarnings,
    getDriverAssignedRides
};
