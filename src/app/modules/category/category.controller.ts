import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { catergoryServices } from "./category.service";
import httpStatus from "http-status";

const createCategory = catchAsync(
    async (req, res) => {
        const payload = req.body;
        const result = await catergoryServices.createCategory(payload);
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Category Created Successfully",
            data: result
        })
    }
)

export const categoryController = {
    createCategory,
}