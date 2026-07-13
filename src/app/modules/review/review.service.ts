import { PaymentStatus, RentalRequestStatus } from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface"
import httpStatus from 'http-status';

const createReview = async (payload: ICreateReview, tenantId: string) => {
    const { propertyId, rating, comment } = payload;
    if (!propertyId || rating === undefined || !comment?.trim()) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "All fields are required."
        );
    }

    if (rating < 1 || rating > 5) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Rating must be between 1 and 5."
        );
    }

    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
    });

    if (!property) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Property not found."
        );
    }

    // Check approved rental request
    const rentalRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: RentalRequestStatus.APPROVED,
        },
    });

    if (!rentalRequest) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You can only review properties you have rented."
        );
    }

    // Check payment
    const payment = await prisma.payment.findUnique({
        where: {
            rentalRequestId: rentalRequest.id,
        },
    });

    if (!payment || payment.status !== PaymentStatus.PAID) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You can review only after completing the payment."
        );
    }

    // Prevent duplicate review
    const existingReview = await prisma.review.findUnique({
        where: {
            tenantId_propertyId: {
                tenantId,
                propertyId,
            },
        },
    });

    if (existingReview) {
        throw new AppError(
            httpStatus.CONFLICT,
            "You have already reviewed this property."
        );
    }

    // Create review
    const review = await prisma.review.create({
        data: {
            tenantId,
            propertyId,
            rating,
            comment: comment.trim(),
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

    return review;
}


export const reviewServices = {
    createReview,
}