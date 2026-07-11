import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { propertyController } from "./property.controller";

const router = Router();

router.post(
    "/",
    auth(UserRole.LANDLORD),
    propertyController.createProperty
);

export const propertyRotues = router;