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

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password: string,
    role: Role,
    phone?: string,
    picture?: string,
    address?: string,
    isDeleted?: boolean,
    isActive?: string,
    isVerified?: boolean,
    auths: IAuthProvider[]
}