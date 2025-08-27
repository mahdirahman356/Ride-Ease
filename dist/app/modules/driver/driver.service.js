"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const constants_1 = require("../../../constants");
const driverRideAssign = (status, driverId, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(400, `Driver not found`);
    }
    if (!driver.isOnline) {
        throw new AppError_1.default(403, "Driver is currently offline");
    }
    if (!driver.isApproved) {
        throw new AppError_1.default(403, "Driver is not approved by admin");
    }
    if (driver.isActive === user_interface_1.IsActive.BLOCKED || driver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${driver.isActive}`);
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
const getMyRideHistory = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(userId);
    if (!driver) {
        throw new AppError_1.default(400, `Driver not found`);
    }
    if (!driver.isApproved) {
        throw new AppError_1.default(403, "Driver is not approved by admin");
    }
    if (driver.isActive === user_interface_1.IsActive.BLOCKED || driver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${driver.isActive}`);
    }
    const myRides = ride_model_1.Ride.find({ driver: userId })
        .populate("rider", "name phone role");
    const queryBuilder = new QueryBuilder_1.QueryBuilder(myRides, query);
    const rides = queryBuilder
        .filter()
        .search(constants_1.rideSearchableFilds)
        .sort()
        .filter()
        .paginate();
    const [data, meta] = yield Promise.all([
        rides.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const rideRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(userId);
    if (!driver) {
        throw new AppError_1.default(400, `Driver not found`);
    }
    if (!driver.isApproved) {
        throw new AppError_1.default(403, "Driver is not approved by admin");
    }
    if (driver.isActive === user_interface_1.IsActive.BLOCKED || driver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${driver.isActive}`);
    }
    const rideRequests = yield ride_model_1.Ride.find({ status: "REQUESTED" })
        .populate("rider", "name address");
    if (!rideRequests || rideRequests.length === 0) {
        return {
            message: "No requests found",
        };
    }
    return rideRequests;
});
const getMyEarnings = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(userId);
    const { filter } = query;
    if (!driver) {
        throw new AppError_1.default(400, `Driver not found`);
    }
    if (!driver.isApproved) {
        throw new AppError_1.default(403, "Driver is not approved by admin");
    }
    if (driver.isActive === user_interface_1.IsActive.BLOCKED || driver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${driver.isActive}`);
    }
    let groupFormat;
    let projectFormat;
    switch (filter) {
        case 'daily':
            groupFormat = {
                $dateToString: { format: '%Y-%m-%d', date: '$statusHistory.completedAt' },
            };
            projectFormat = { label: '$_id', earnings: '$totalEarnings' };
            break;
        case 'monthly':
            groupFormat = {
                $dateToString: { format: '%Y-%m', date: '$statusHistory.completedAt' },
            };
            projectFormat = { label: '$_id', earnings: '$totalEarnings' };
            break;
        default:
            return { message: 'Invalid time range specified' };
    }
    const driverObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const earningsData = yield ride_model_1.Ride.aggregate([
        {
            $match: {
                driver: driverObjectId,
                status: 'COMPLETED',
            },
        },
        {
            $group: {
                _id: groupFormat,
                totalEarnings: { $sum: '$fareEstimation' },
            },
        },
        {
            $sort: { _id: 1 },
        },
        {
            $project: projectFormat,
        },
    ]);
    return earningsData;
});
const getDriverAssignedRides = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(userId);
    if (!driver) {
        throw new AppError_1.default(400, `Driver not found`);
    }
    if (!driver.isOnline) {
        throw new AppError_1.default(403, "Driver is currently offline");
    }
    if (!driver.isApproved) {
        throw new AppError_1.default(403, "Driver is not approved by admin");
    }
    if (driver.isActive === user_interface_1.IsActive.BLOCKED || driver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(400, `User is ${driver.isActive}`);
    }
    const validStatuses = [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT];
    const ride = yield ride_model_1.Ride.find({ driver: userId, status: { $in: validStatuses } })
        .populate("rider", "name address");
    if (!ride || ride.length === 0) {
        return {
            message: "No assigned ride found for the driver.",
        };
    }
    return ride;
});
exports.DriverServices = {
    driverRideAssign,
    getMyRideHistory,
    getMyEarnings,
    rideRequests,
    getDriverAssignedRides
};
