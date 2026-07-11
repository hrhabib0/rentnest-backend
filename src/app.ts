import express from "express";
import cors from "cors";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import AppError from "./app/errors/AppError";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Welcome to RentNest API",
    });
});

app.get("/test", (req, res) => {
    throw new AppError(400, "This is a test error");
});


app.use(notFound);

app.use(globalErrorHandler);

export default app;