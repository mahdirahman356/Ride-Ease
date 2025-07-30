import { Router } from "express";
import { UserRoute } from "../app/modules/user/user.route";
import { AuthRoute } from "../app/modules/auth/auth.route";
import { RideRoute } from "../app/modules/ride/ride.route";
import { DriverRoute } from "../app/modules/driver/driver.route";


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoute
    },
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/rides",
        route: RideRoute
    },
    {
        path: "/drivers",
        route: DriverRoute
    },

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})