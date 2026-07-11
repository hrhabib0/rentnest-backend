import { Router } from "express";
import { authConroller } from "./auth.controller";

const router = Router();

router.post('/register', authConroller.registerUser);
router.post('/login', authConroller.logInUser);

export const authRoutes = router;