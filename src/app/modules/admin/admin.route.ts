import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();


router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);
router.patch("/users/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);
router.get("/properties", auth(UserRole.ADMIN), adminController.getAllProperties);
router.get("/rentals", auth(UserRole.ADMIN), adminController.getAllRentals);


export const adminRoutes = router;