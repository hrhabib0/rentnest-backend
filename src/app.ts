import express from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { authRoutes } from "./app/modules/auth/auth.route";
import cookieParser from "cookie-parser";
import { catergoryRoutes } from "./app/modules/category/category.route";
import { propertyRotues } from "./app/modules/property/property.route";

const app = express();

app.use(cors());
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

app.use('/api/landlord/properties', propertyRotues);


app.use(notFound);

app.use(globalErrorHandler);

export default app;