import { UserStatus } from "../../../../generated/prisma/enums";
import { PrismaQueryBuilder } from "../../builder/prismaQueryBuilder";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from 'http-status';

const getAllUsers = async (
    query: Record<string, unknown>
) => {
    const queryBuilder = new PrismaQueryBuilder(query)
        .search(["name", "email"])
        .filter(["role", "status"])
        .sort(["createdAt", "name"])
        .paginate();

    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            where: queryBuilder.where,
            orderBy: queryBuilder.orderBy,
            skip: queryBuilder.skip,
            take: queryBuilder.take,
            omit: {
                password: true,
            },
        }),
        prisma.user.count({
            where: queryBuilder.where,
        }),
    ]);

    return {
        meta: {
            page: queryBuilder.page,
            limit: queryBuilder.take,
            total,
            totalPages: Math.ceil(total / queryBuilder.take),
        },
        data: users,
    };
};

const updateUserStatus = async (
    userId: string,
    status: UserStatus,
    adminId: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User not found."
        );
    }

    if (user.id === adminId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You cannot update your own account status."
        );
    }

    if (
        ![UserStatus.ACTIVE, UserStatus.BLOCKED].includes(status)
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Invalid user status."
        );
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status,
        },
        omit: {
            password: true,
        },
    });

    return updatedUser;
};

const getAllProperties = async (
    query: Record<string, unknown>
) => {
    const queryBuilder = new PrismaQueryBuilder(query)
        .search(["title", "city", "address"])
        .filter(["status", "city", "categoryId"])
        .sort(["createdAt", "monthlyRent", "title"])
        .paginate();

    const [properties, total] = await prisma.$transaction([
        prisma.property.findMany({
            where: queryBuilder.where,
            orderBy: queryBuilder.orderBy,
            skip: queryBuilder.skip,
            take: queryBuilder.take,
            include: {
                landlord: {
                    omit: {
                        password: true,
                    },
                },
                category: true,
                _count: {
                    select: {
                        rentalRequests: true,
                        reviews: true,
                    },
                },
            },
        }),
        prisma.property.count({
            where: queryBuilder.where,
        }),
    ]);

    return {
        meta: {
            page: queryBuilder.page,
            limit: queryBuilder.take,
            total,
            totalPages: Math.ceil(total / queryBuilder.take),
        },
        data: properties,
    };
};

const getAllRentals = async (
    query: Record<string, unknown>
) => {
    const queryBuilder = new PrismaQueryBuilder(query)
        .search([])
        .filter(["status"])
        .sort(["createdAt", "moveInDate"])
        .paginate();

    const [rentals, total] = await prisma.$transaction([
        prisma.rentalRequest.findMany({
            where: queryBuilder.where,
            orderBy: queryBuilder.orderBy,
            skip: queryBuilder.skip,
            take: queryBuilder.take,
            include: {
                tenant: {
                    omit: {
                        password: true,
                    },
                },
                property: {
                    include: {
                        category: true,
                        landlord: {
                            omit: {
                                password: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        }),
        prisma.rentalRequest.count({
            where: queryBuilder.where,
        }),
    ]);

    return {
        meta: {
            page: queryBuilder.page,
            limit: queryBuilder.take,
            total,
            totalPages: Math.ceil(total / queryBuilder.take),
        },
        data: rentals,
    };
};


export const adminServices = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
}