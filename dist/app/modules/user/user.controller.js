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
exports.UserController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "User Created Successfully",
        data: user
    });
}));
const updateAvailability = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { isOnline } = req.body;
    yield user_service_1.UserServices.updateAvailability(isOnline, decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Availability status updated to ${isOnline ? "Online" : "Offline"}.`,
        data: null
    });
}));
const viewAllTypeOfUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.query;
    const result = yield user_service_1.UserServices.viewAllTypeOfUsers(type);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Successfully retrieved all ${type}s.`,
        data: result
    });
}));
const updateDriverApproval = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { isApproved } = req.body;
    const driverId = req.params.id;
    yield user_service_1.UserServices.updateDriverApproval(isApproved, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Driver has been ${isApproved ? "approved" : "suspended"}`,
        data: null
    });
}));
const setUserActiveStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { isActive } = req.body;
    const userId = req.params.id;
    yield user_service_1.UserServices.setUserActiveStatus(isActive, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `User has been ${isActive.toLowerCase()}`,
        data: null
    });
}));
exports.UserController = {
    createUser,
    updateAvailability,
    viewAllTypeOfUsers,
    updateDriverApproval,
    setUserActiveStatus
};
