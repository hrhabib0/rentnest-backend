import { PropertyStatus, RentalRequestStatus } from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest } from "./rentalRequest.interface";
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

export const rentalRequestServices = {
    createRentalRequest,
}