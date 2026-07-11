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

export const propertyController = {
    createProperty
}