import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { propertyController } from "./property.controller";

const router = Router();

router.post(
    "/landlord/properties",
    auth(UserRole.LANDLORD),
    propertyController.createProperty
);
router.get(
    "/properties",
    propertyController.getAllProperties
);

export const propertyRotues = router;