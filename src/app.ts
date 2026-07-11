import express from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import AppError from "./app/errors/AppError";
import { authRoutes } from "./app/modules/auth/auth.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Welcome to RentNest API",
    });
});

app.use("/api/auth", authRoutes);


app.use(notFound);

app.use(globalErrorHandler);

export default app;