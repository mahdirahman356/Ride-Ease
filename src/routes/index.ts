import { Router } from "express";
import { UserRoute } from "../app/modules/user/user.route";
import { AuthRoute } from "../app/modules/auth/auth.route";


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

]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})