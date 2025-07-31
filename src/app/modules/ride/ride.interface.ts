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

export interface ILocation {
    address?: string;
    lat: number;
    lng: number;
}

export interface IStatusHistory {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    inTransitAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    rejectedAt?: Date;

}

export interface IRide {
    rider: Types.ObjectId,
    driver: Types.ObjectId,
    pickupLocation: ILocation,
    destinationLocation: ILocation,
    status: RideStatus,
    statusHistory: IStatusHistory
}