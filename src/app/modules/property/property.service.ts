import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../../../generated/prisma/enums";
import { PrismaQueryBuilder } from "../../builder/prismaQueryBuilder";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IUpdateProperty } from "./property.interface";
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

const getPropertyById = async (id: string) => {
    const property = await prisma.property.findUnique({
        where: {
            id
        },
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true
                }
            },
            reviews: {
                include: {
                    tenant: {
                        omit: {
                            password: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
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

    if (!property) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Property not found."
        );
    }

    return property;
};

const updateProperty = async (
    id: string,
    payload: IUpdateProperty,
    user: JwtPayload
) => {
    const property = await prisma.property.findUnique({
        where: {
            id
        }
    });

    if (!property) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Property not found."
        );
    }

    // Ownership check
    if (
        property.landlordId !== user.id &&
        user.role !== UserRole.ADMIN
    ) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to update this property."
        );
    }

    // Validate category if changing it
    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: payload.categoryId
            }
        });

        if (!category) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                "Category not found."
            );
        }
    }

    const updatedProperty = await prisma.property.update({
        where: {
            id
        },
        data: payload,
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true
                }
            }
        }
    });

    return updatedProperty;
};

export const propertyServices = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty
}