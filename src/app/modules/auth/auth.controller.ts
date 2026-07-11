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

const logInUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body
        const result = await authServices.logInUser(payload);
        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24
        });
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged in Successfully",
            data: result
        })
    }
)

export const authConroller = {
    registerUser,
    logInUser,
}