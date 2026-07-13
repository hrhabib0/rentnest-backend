import { JwtPayload } from "jsonwebtoken";
import { PropertyStatus, RentalRequestStatus, UserRole } from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest, IUpdateRentalRequestStatus } from "./rentalRequest.interface";
import httpStatus from "http-status";

const createRentalRequest = async (payload: ICreateRentalRequest, tenantId: string) => {
    const { propertyId, moveInDate } = payload;

    if (!propertyId || !moveInDate) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Property and move-in date are required."
        );
    }

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    })

    if (!property) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Property not found."
        );
    }

    if (property.status !== PropertyStatus.AVAILABLE) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "This property is not available."
        );
    }

    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: RentalRequestStatus.PENDING
        }
    });

    if (existingRequest) {
        throw new AppError(
            httpStatus.CONFLICT,
            "You already have a pending request for this property."
        );
    }

    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId,
            moveInDate: new Date(moveInDate),
            message: payload.message
        },
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true
                }
            }
        }
    });

    return rentalRequest;
}

const getMyRentalRequest = async (tenantId: string) => {
    const myRentalRequest = await prisma.rentalRequest.findMany({
        where: {
            tenantId
        },
        include: {
            property: {
                include: {
                    category: true,
                    landlord: {
                        omit: {
                            password: true
                        }
                    }
                }
            },
            payment: true,
        },
        orderBy: {
            createdAt: "desc"
        }

    });
    return myRentalRequest;
}

const getReceivedRentalRequests = async (landlordId: string) => {
    const requests = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId
            }
        },
        include: {
            tenant: {
                omit: {
                    password: true
                }
            },
            property: {
                include: {
                    category: true
                }
            },
            payment: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return requests;
};

const updateRentalRequestStatus = async (
    requestId: string,
    payload: IUpdateRentalRequestStatus,
    landlordId: string
) => {
    const { status } = payload;

    if (
        status !== RentalRequestStatus.APPROVED &&
        status !== RentalRequestStatus.REJECTED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Invalid rental request status."
        );
    }

    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId,
        },
        include: {
            property: true,
        },
    });

    if (!rentalRequest) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Rental request not found."
        );
    }

    if (rentalRequest.property.landlordId !== landlordId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to update this rental request."
        );
    }

    if (rentalRequest.status !== RentalRequestStatus.PENDING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "This rental request has already been processed."
        );
    }

    const result = await prisma.$transaction(async (tx) => {
        // Update selected request
        const updatedRequest = await tx.rentalRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status,
            },
            include: {
                tenant: {
                    omit: {
                        password: true,
                    },
                },
                property: true,
            },
        });

        // If approved, update property and reject others
        if (status === RentalRequestStatus.APPROVED) {
            await tx.property.update({
                where: {
                    id: rentalRequest.propertyId,
                },
                data: {
                    status: PropertyStatus.RENTED,
                },
            });

            await tx.rentalRequest.updateMany({
                where: {
                    propertyId: rentalRequest.propertyId,
                    id: {
                        not: requestId,
                    },
                    status: RentalRequestStatus.PENDING,
                },
                data: {
                    status: RentalRequestStatus.REJECTED,
                },
            });
        }

        return updatedRequest;
    });

    return result;
};

const getRentalRequestById = async (rentalRequestId: string, user: JwtPayload) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: rentalRequestId,
        },
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: {
                include: {
                    landlord: {
                        omit: {
                            password: true,
                        },
                    },
                    category: true,
                },
            },
            payment: true,
        },
    });

    if (!rentalRequest) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Rental request not found."
        );
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const isTenant = rentalRequest.tenantId === user.id;
    const isLandlord = rentalRequest.property.landlordId === user.id;

    if (!isAdmin && !isTenant && !isLandlord) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to access this rental request."
        );
    }

    return rentalRequest;
};

export const rentalRequestServices = {
    createRentalRequest,
    getMyRentalRequest,
    getReceivedRentalRequests,
    updateRentalRequestStatus,
    getRentalRequestById,
}