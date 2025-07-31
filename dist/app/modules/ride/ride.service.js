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
exports.RideServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const MAX_CANCELS_PER_DAY = 3;
const rideRequest = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingActiveRide = yield ride_model_1.Ride.findOne({
        rider: userId,
        status: { $in: [ride_interface_1.RideStatus.REQUESTED, ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT] },
    });
    if (existingActiveRide) {
        throw new AppError_1.default(400, "You already have an active ride.");
    }
    const availableDrivers = yield user_model_1.User.find({
        role: "DRIVER",
        isOnline: true,
        isApproved: true,
        isDeleted: false,
        isActive: "ACTIVE",
    });
    if (!availableDrivers.length) {
        throw new AppError_1.default(404, "No available drivers right now.");
    }
    const rideRequest = yield ride_model_1.Ride.create(Object.assign({ rider: userId }, payload));
    return rideRequest;
});
const getMyRideRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId);
    const myRides = yield ride_model_1.Ride.find({ rider: userId });
    if (!myRides || myRides.length === 0) {
        return {
            message: "No rides found in your history.",
        };
    }
    return myRides;
});
const rideStatusUpdate = (status, userId, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(404, "Ride not found");
    }
    if (status !== ride_interface_1.RideStatus.CANCELLED) {
        throw new AppError_1.default(400, "Invalid ride status.");
    }
    if (ride.rider.toString() !== userId) {
        throw new AppError_1.default(403, "You are not allowed to update this ride");
    }
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(400, `Ride cannot be cancelled because it is already ${ride.status.toLowerCase().replace('_', ' ')}.`);
    }
    const rider = yield user_model_1.User.findById(userId);
    if (!rider) {
        throw new AppError_1.default(404, "Rider not found");
    }
    const now = new Date();
    if (rider.lastCancelAt && now.getTime() - rider.lastCancelAt.getTime() > 24 * 60 * 60 * 1000) {
        rider.cancelAttempts = 0;
    }
    if (rider.cancelAttempts >= MAX_CANCELS_PER_DAY) {
        throw new AppError_1.default(403, "You have reached the maximum number of ride cancellations allowed today.");
    }
    ride.status = status;
    ride.statusHistory.cancelledAt = now;
    rider.cancelAttempts = (rider.cancelAttempts || 0) + 1;
    rider.lastCancelAt = now;
    yield Promise.all([ride.save(), rider.save()]);
});
exports.RideServices = {
    rideRequest,
    getMyRideRequest,
    rideStatusUpdate
};
