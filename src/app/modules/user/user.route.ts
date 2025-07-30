import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()
router.post("/register", validateRequest(createUserZodSchema), UserController.createUser)
router.patch("/availability", checkAuth(Role.DRIVER), UserController.updateAvailability)

export const UserRoute = router