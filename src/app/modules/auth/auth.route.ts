import { Router } from "express";
import { authConroller } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();

router.post('/register', authConroller.registerUser);
router.post('/login', authConroller.logInUser);
router.get(
    "/me",
    auth(UserRole.ADMIN, UserRole.TENANT, UserRole.LANDLORD),
    authConroller.getMe
);

export const authRoutes = router;