import { model, Schema, Types } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";


const RideSchema = new Schema<IRide>({
    rider: {type: Schema.Types.ObjectId, ref: "User", required: true},
    driver: {type: Schema.Types.ObjectId, ref: "User",  default: null},
    pickupLocation: {type: String, required: true},
    destinationLocation: {type: String, required: true},
    status: {type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED}
},{
    versionKey: false,
    timestamps: true
})

export const Ride = model<IRide>("Ride", RideSchema)