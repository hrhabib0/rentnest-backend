import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();


router.post(
    "/create-checkout-session/:rentalRequestId",
    auth(UserRole.TENANT),
    paymentController.createPaymentIntent
);
router.post('/webhook', paymentController.handleStripeWebhook);
router.get("/my-payments", auth(UserRole.TENANT), paymentController.getMyPayments);
router.get("/:id", auth(UserRole.TENANT), paymentController.getPaymentById);

export const paymentRoutes = router;