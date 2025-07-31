"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../app/modules/user/user.route");
const auth_route_1 = require("../app/modules/auth/auth.route");
const ride_route_1 = require("../app/modules/ride/ride.route");
const driver_route_1 = require("../app/modules/driver/driver.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoute
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute
    },
    {
        path: "/rides",
        route: ride_route_1.RideRoute
    },
    {
        path: "/drivers",
        route: driver_route_1.DriverRoute
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
