import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";
import httpStatus from "http-status";


const createPaymentIntent = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await paymentServices.createPaymentIntent(
                req.params.rentalRequestId as string,
                req.user!.id
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Checkout session created successfully.",
            data: result,
        });
    }
);

const handleStripeWebhook = catchAsync(
    async (req: Request, res: Response) => {
        const event = req.body
        const signature = req.headers['stripe-signature'];
        await paymentServices.handleStripeWebhook(event, signature as string);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Webhook triggered successfully",
            data: null
        })
    }
);

const getMyPayments = catchAsync(
    async (req: Request, res: Response) => {
        const result = await paymentServices.getMyPayments(
            req.user!.id,
            req.query as Record<string, unknown>
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment history retrieved successfully.",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getPaymentById = catchAsync(
    async (req: Request, res: Response) => {
        const result = await paymentServices.getPaymentById(
            req.params.id as string,
            req.user!.id
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Payment retrieved successfully.",
            data: result,
        });
    }
);

export const paymentController = {
    createPaymentIntent,
    handleStripeWebhook,
    getMyPayments,
    getPaymentById,
}