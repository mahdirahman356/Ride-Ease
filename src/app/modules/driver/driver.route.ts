import { Router } from "express"
import { DriverControllers } from "./driver.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

router.patch("/assign-ride/:id",
    checkAuth(Role.DRIVER),
    DriverControllers.approveDriver)

router.get("/my-earnings",
    checkAuth(Role.DRIVER),
    DriverControllers.getMyEarnings)

router.get("/assigned-ride",
    checkAuth(Role.DRIVER),
    DriverControllers.getDriverAssignedRides )
export const DriverRoute = router