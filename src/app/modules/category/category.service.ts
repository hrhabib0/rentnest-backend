import AppError from "../../errors/AppError";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";


const createCategory = async (payload: ICreateCategory) => {
    const normalizedCategoryName = payload.name?.trim() ?? "";
    if (!normalizedCategoryName) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Name required."
        );
    }
    const isCategoryExist = await prisma.category.findUnique({
        where: {
            name: normalizedCategoryName
        }
    })

    if (isCategoryExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            "This category name already exist"
        )
    }

    const category = await prisma.category.create({
        data: {
            name: payload.name,
            description: payload.description
        }
    })
    return { category }
}

const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc"
        },
        include: {
            _count: {
                select: {
                    properties: true
                }
            }
        }
    });
    return categories;
}

const getCategoryById = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            _count: {
                select: {
                    properties: true
                }
            }
        }
    });
    if (!category) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Category not found."
        );
    }
    return category;
}


export const categoryServices = {
    createCategory,
    getAllCategories,
    getCategoryById
}