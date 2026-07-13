import express from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { authRoutes } from "./app/modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { catergoryRoutes } from "./app/modules/category/category.route";
import { propertyRotues } from "./app/modules/property/property.route";
import { rentalRequestRoutes } from "./app/modules/rentalRequest/rentalRequest.route";
import { paymentRoutes } from "./app/modules/payment/payment.route";
import { reviewRoutes } from "./app/modules/review/review.route";

const app = express();

app.use(cors());

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Welcome to RentNest API",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", catergoryRoutes);

app.use('/api', propertyRotues);

app.use('/api/rental-requests', rentalRequestRoutes);

app.use('/api/payments', paymentRoutes);

app.use('/api/reviews', reviewRoutes);


app.use(notFound);

app.use(globalErrorHandler);

export default app;