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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_model_1 = require("../ride/ride.model");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, role, isOnline } = payload, rest = __rest(payload, ["email", "password", "role", "isOnline"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(400, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = { provider: "credentials", providerId: email };
    const userData = Object.assign({ email, password: hashedPassword, role, auths: [authProvider] }, rest);
    if (role === "DRIVER") {
        userData.isApproved = false;
        userData.isOnline = isOnline !== null && isOnline !== void 0 ? isOnline : false;
        userData.vehicleInfo = (_a = payload.vehicleInfo) !== null && _a !== void 0 ? _a : null;
    }
    const user = yield user_model_1.User.create(userData);
    return user;
});
const updateAvailability = (isOnline, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, "User Not Found");
    }
    user.isOnline = isOnline;
    yield user.save();
});
const viewAllTypeOfUsers = (type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!type) {
        throw new AppError_1.default(400, "Query parameter 'type' is required (user | driver | ride)");
    }
    let data;
    if (type === "user") {
        data = yield user_model_1.User.find({ role: { $ne: "ADMIN" } }, "-password");
    }
    if (type === "driver") {
        data = yield user_model_1.User.find({ role: "DRIVER" }, "-password");
    }
    if (type === "ride") {
        data = yield ride_model_1.Ride.find()
            .populate("rider", "name phone")
            .populate("driver", "name phone");
    }
    return data;
});
const updateDriverApproval = (isApproved, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield user_model_1.User.findById(driverId);
    if (!driver || driver.role !== "DRIVER") {
        throw new AppError_1.default(404, "Driver not found");
    }
    driver.isApproved = isApproved;
    yield driver.save();
});
const setUserActiveStatus = (isActive, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(user_interface_1.IsActive).includes(isActive)) {
        throw new AppError_1.default(400, `Invalid isActive status. Valid values are: ${Object.values(user_interface_1.IsActive).join(", ")}`);
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    user.isActive = isActive;
    yield user.save();
});
exports.UserServices = {
    createUser,
    updateAvailability,
    viewAllTypeOfUsers,
    updateDriverApproval,
    setUserActiveStatus
};
