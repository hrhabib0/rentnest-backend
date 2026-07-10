import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        success: true,
        message: "Welcome to RentNest API",
    });
});

export default app;