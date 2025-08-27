import { Router } from "express"
import { DriverControllers } from "./driver.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

router.patch("/assign-ride/:id",
    checkAuth(Role.DRIVER),
    DriverControllers.driverRideAssign)

router.get("/my-ride-history",
    checkAuth(Role.DRIVER),
    DriverControllers.getMyRideHistory)    

router.get("/my-earnings",
    checkAuth(Role.DRIVER),
    DriverControllers.getMyEarnings)

router.get("/ride-requests",
    checkAuth(Role.DRIVER),
    DriverControllers.rideRequests)

router.get("/assigned-ride",
    checkAuth(Role.DRIVER),
    DriverControllers.getDriverAssignedRides )
export const DriverRoute = router