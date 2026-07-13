import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();


router.post("/", auth(UserRole.TENANT), reviewController.createReview);
router.get('/property/:propertyId', reviewController.getReviewsByProperty);
router.patch("/:id", auth(UserRole.TENANT), reviewController.updateReview);
router.delete("/:id", auth(UserRole.TENANT, UserRole.ADMIN), reviewController.deleteReview);



export const reviewRoutes = router;