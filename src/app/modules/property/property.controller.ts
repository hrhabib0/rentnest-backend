import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyServices } from "./property.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const landlordId = req.user?.id
        const result = await propertyServices.createProperty(payload, landlordId as string);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Property Created Successfully",
            data: result
        })
    }
)

const getAllProperties = catchAsync(
    async (req: Request, res: Response) => {
        const result = await propertyServices.getAllProperties(req.query);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Properties retrieved successfully",
            meta: result.meta,
            data: result.data
        });
    }
);

const getPropertyById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const property = await propertyServices.getPropertyById(id as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property retrieved successfully.",
            data: property
        });
    }
);

const updateProperty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const updatedProperty =
            await propertyServices.updateProperty(
                id as string,
                req.body,
                req.user!
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Property updated successfully.",
            data: updatedProperty
        });
    }
);

export const propertyController = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
}