import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from 'http-status';

const getAllUsers = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await adminServices.getAllUsers(
                req.query as Record<string, unknown>
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Users retrieved successfully.",
            meta: result.meta,
            data: result.data,
        });
    }
);

const updateUserStatus = catchAsync(
    async (req: Request, res: Response) => {
        console.log(req.body, "req body")
        const result = await adminServices.updateUserStatus(
            req.params.id as string,
            req.body.status,
            req.user!.id
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User status updated successfully.",
            data: result,
        });
    }
);

const getAllProperties = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminServices.getAllProperties(
            req.query as Record<string, unknown>
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Properties retrieved successfully.",
            meta: result.meta,
            data: result.data,
        });
    }
);

const getAllRentals = catchAsync(
    async (req: Request, res: Response) => {
        const result = await adminServices.getAllRentals(
            req.query as Record<string, unknown>
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully.",
            meta: result.meta,
            data: result.data,
        });
    }
);


export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
}