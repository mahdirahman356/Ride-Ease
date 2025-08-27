import { model, Schema, Types } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";


const RideSchema = new Schema<IRide>({
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    pickupLocation: {type: String },
    destinationLocation: {type: String },
    fareEstimation: {type: Number},
    paymentMethod: {type: String},
    status: { type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED },
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
})

export const Ride = model<IRide>("Ride", RideSchema)