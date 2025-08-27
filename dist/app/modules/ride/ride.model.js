"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const RideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    pickupLocation: { type: String },
    destinationLocation: { type: String },
    fareEstimation: { type: Number },
    paymentMethod: { type: String },
    status: { type: String, enum: Object.values(ride_interface_1.RideStatus), default: ride_interface_1.RideStatus.REQUESTED },
    statusHistory: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date },
        pickedUpAt: { type: Date },
        inTransitAt: { type: Date },
        completedAt: { type: Date },
        cancelledAt: { type: Date },
        rejectedAt: { type: Date },
    },
}, {
    versionKey: false,
    timestamps: true
});
exports.Ride = (0, mongoose_1.model)("Ride", RideSchema);
