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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const driver_service_1 = require("./driver.service");
const driverRideAssign = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const decodedToken = req.user;
    const rideId = req.params.id;
    yield driver_service_1.DriverServices.driverRideAssign(status, decodedToken.userId, rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Ride status has been updated to '${status}'.`,
        data: null
    });
}));
const getMyRideHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    console.log(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId);
    const result = yield driver_service_1.DriverServices.getMyRideHistory(query, decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Rides retrieved successfully",
        data: result
    });
}));
const rideRequests = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield driver_service_1.DriverServices.rideRequests(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Ride Requests retrieved successfully",
        data: result
    });
}));
const getMyEarnings = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const query = req.query;
    const result = yield driver_service_1.DriverServices.getMyEarnings(decodedToken.userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Earnings history retrieved successfully",
        data: result
    });
}));
const getDriverAssignedRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield driver_service_1.DriverServices.getDriverAssignedRides(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Assigned ride retrieved successfully",
        data: result
    });
}));
exports.DriverControllers = {
    driverRideAssign,
    getMyRideHistory,
    getMyEarnings,
    rideRequests,
    getDriverAssignedRides
};
