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

const getReviewsByProperty = catchAsync(
    async (req: Request, res: Response) => {
        const { propertyId } = req.params;
        const result = await reviewServices.getReviewsByProperty(propertyId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Reviews Retrieve Successfully.",
            data: result,
        })
    }
)

const updateReview = catchAsync(
    async (req: Request, res: Response) => {
        const result = await reviewServices.updateReview(
            req.params.id as string,
            req.body,
            req.user!.id
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review updated successfully.",
            data: result,
        });
    }
);

const deleteReview = catchAsync(
    async (req: Request, res: Response) => {
        await reviewServices.deleteReview(
            req.params.id as string,
            req.user!
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review deleted successfully.",
            data: null,
        });
    }
);


export const reviewController = {
    createReview,
    getReviewsByProperty,
    updateReview,
    deleteReview,
}