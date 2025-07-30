import { Types } from "mongoose";

export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface IRide {
    rider: Types.ObjectId,
    driver: Types.ObjectId,
    pickupLocation: string,
    destinationLocation: string,
    status: RideStatus
}