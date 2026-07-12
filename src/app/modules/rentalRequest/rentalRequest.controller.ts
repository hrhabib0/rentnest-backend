import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestServices } from "./rentalRequest.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRentalRequest = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const tenantId = req.user?.id;
        const result = await rentalRequestServices.createRentalRequest(payload, tenantId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Rental Request Created Successfully",
            data: result
        })
    }
)

const getMyRentalRequest = catchAsync(
    async (req: Request, res: Response) => {
        const tenantId = req.user?.id;
        const result = await rentalRequestServices.getMyRentalRequest(tenantId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully.",
            data: result
        })
    }
)

const getReceivedRentalRequests = catchAsync(
    async (req: Request, res: Response) => {
        const requests =
            await rentalRequestServices.getReceivedRentalRequests(
                req.user!.id
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Received rental requests retrieved successfully.",
            data: requests
        });
    }
);

const updateRentalRequestStatus = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await rentalRequestServices.updateRentalRequestStatus(
                req.params.id as string,
                req.body,
                req.user!.id
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental request updated successfully.",
            data: result,
        });
    }
);


export const rentalRequestController = {
    createRentalRequest,
    getMyRentalRequest,
    getReceivedRentalRequests,
    updateRentalRequestStatus
}