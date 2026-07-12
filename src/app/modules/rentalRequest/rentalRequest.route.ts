import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = Router();


router.post('/', auth(UserRole.TENANT), rentalRequestController.createRentalRequest);
router.get('/my-requests', auth(UserRole.TENANT), rentalRequestController.getMyRentalRequest);


export const rentalRequestRoutes = router;