import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewServices } from "./review.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';


const createReview = catchAsync(
    async (req: Request, res: Response) => {
        const result = await reviewServices.createReview(
            req.body,
            req.user!.id
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Review created successfully.",
            data: result,
        });
    }
);


export const reviewController = {
    createReview,
}