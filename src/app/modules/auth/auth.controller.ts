import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const registerUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const user = await authServices.registerUserIntoDB(payload);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User Registered Successfully",
            data: user
        })
    }
)

export const authConroller = {
    registerUser,
}