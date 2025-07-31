import { Types } from "mongoose"

export enum Role {
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER"
}

export interface IAuthProvider {
    provider: "google" | "credentials",
    providerId: string
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IVehicleInfo {
    model: string;
    plateNumber: string;
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password: string,
    role: Role,
    phone?: string,
    picture?: string,
    address?: string,
    cancelAttempts: number,
    lastCancelAt: Date,
    isApproved: boolean,
    isOnline: boolean,
    isDeleted?: boolean,
    isActive?: string,
    isVerified?: boolean,
    vehicleInfo?: IVehicleInfo | null;
    auths: IAuthProvider[]
}