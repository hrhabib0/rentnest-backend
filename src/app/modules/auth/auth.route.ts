import { Router } from "express";
import { authConroller } from "./auth.controller";

const router = Router();

router.post('/register', authConroller.registerUser)

export const authRoutes = router;