import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()
router.post("/register",
    validateRequest(createUserZodSchema),
    UserController.createUser)

router.patch("/availability", 
    checkAuth(Role.DRIVER), 
    UserController.updateAvailability)

router.get("/view", 
    checkAuth(Role.ADMIN), 
    UserController.viewAllTypeOfUsers)

router.patch(
  "/drivers/approve/:id",
  checkAuth(Role.ADMIN),
  UserController.updateDriverApproval
);    

router.patch(
  "/activity-status/:id",
  checkAuth(Role.ADMIN),
  UserController.setUserActiveStatus
);

export const UserRoute = router