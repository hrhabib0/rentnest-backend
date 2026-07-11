import { PrismaQueryBuilder } from "../../builder/prismaQueryBuilder";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "./property.interface";
import httpStatus from "http-status";


const createProperty = async (
    payload: ICreateProperty,
    landlordId: string
) => {
    const {
        title,
        description,
        address,
        city,
        monthlyRent,
        bedrooms,
        bathrooms,
        size,
        imageUrls,
        amenities,
        categoryId,
    } = payload;

    const normalizedTitle = title?.trim() ?? "";
    const normalizedDescription = description?.trim() ?? "";
    const normalizedAddress = address?.trim() ?? "";
    const normalizedCity = city?.trim() ?? "";

    if (
        !normalizedTitle ||
        !normalizedDescription ||
        !normalizedAddress ||
        !normalizedCity ||
        !categoryId
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "All required fields must be provided."
        );
    }

    if (monthlyRent <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Monthly rent must be greater than 0."
        );
    }

    if (bedrooms < 1) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Bedrooms must be at least 1."
        );
    }

    if (bathrooms < 1) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Bathrooms must be at least 1."
        );
    }

    if (size !== undefined && size <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Property size must be greater than 0."
        );
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "At least one property image is required."
        );
    }

    if (amenities && !Array.isArray(amenities)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Amenities must be an array."
        );
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!category) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Category not found."
        );
    }

    // Create property
    const property = await prisma.property.create({
        data: {
            title: normalizedTitle,
            description: normalizedDescription,
            address: normalizedAddress,
            city: normalizedCity,
            monthlyRent,
            bedrooms,
            bathrooms,
            size,
            imageUrls,
            amenities,
            categoryId,
            landlordId,
        },
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                },
            },
        },
    });

    return property;
};

const getAllProperties = async (query: Record<string, unknown>) => {
    const builder = new PrismaQueryBuilder(query)
        .search(["title", "city", "address"])
        .filter([
            "city",
            "status",
            "categoryId",
            "bedrooms",
            "bathrooms"
        ])
        .priceRange()
        .sort([
            "createdAt",
            "monthlyRent",
            "city",
            "bedrooms",
            "bathrooms"
        ])
        .paginate();

    const properties = await prisma.property.findMany({
        where: builder.where,
        orderBy: builder.orderBy,
        skip: builder.skip,
        take: builder.take,
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    reviews: true,
                    rentalRequests: true
                }
            }
        }
    });

    const total = await prisma.property.count({
        where: builder.where
    });

    return {
        meta: {
            page: builder.page,
            limit: builder.limit,
            total,
            totalPages: Math.ceil(total / builder.limit)
        },
        data: properties
    };
};

export const propertyServices = {
    createProperty,
    getAllProperties
}