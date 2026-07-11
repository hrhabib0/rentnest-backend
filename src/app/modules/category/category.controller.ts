import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";
import httpStatus from "http-status";

const createCategory = catchAsync(
    async (req, res) => {
        const payload = req.body;
        const result = await categoryServices.createCategory(payload);
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
        const result = await categoryServices.getAllCategories();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Categories retrieved successfully",
            data: result,
        });
    }
)

const getCategoryById = catchAsync(
    async (req, res) => {
        const categoryId = req.params.categoryId
        const result = await categoryServices.getCategoryById(categoryId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Category retrieved successfully",
            data: result,
        });
    }
)

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoryById
}