import { Router } from "express"
import { DriverControllers } from "./driver.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"

const router = Router()

router.patch("/approve/:id", checkAuth(Role.DRIVER), DriverControllers.approveDriver)

export const DriverRoute = router