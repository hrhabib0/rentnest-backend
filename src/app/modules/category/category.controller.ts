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

const getAllCategories = catchAsync(
    async (req, res) => {
        const result = await catergoryServices.getAllCategories();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Categories retrieved successfully",
            data: result,
        });
    }
)

export const categoryController = {
    createCategory,
    getAllCategories
}