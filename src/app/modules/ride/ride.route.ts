import { Router } from "express"
import { RideController } from "./ride.controller"
import { checkAuth } from "../../middlewares/checkAuth"
import { Role } from "../user/user.interface"
import { validateRequest } from "../../middlewares/validateRequest"
import { createRidesZodSchema } from "./ride.validation"

const router = Router()
router.post("/request",
    checkAuth(Role.RIDER),
    validateRequest(createRidesZodSchema),
    RideController.rideRequest)

router.get("/me",
    checkAuth(Role.RIDER),
    RideController.getMyRideRequest)

router.patch("/:id/status",
    checkAuth(Role.RIDER),
    RideController.rideStatusUpdate)

export const RideRoute = router