import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "../../../../generated/prisma/client";
import { PaymentStatus, RentalRequestStatus, UserRole } from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateReview, IUpdateReview } from "./review.interface"
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

const getReviewsByProperty = async (propertyId: string) => {
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

    const reviews = await prisma.review.findMany({
        where: {
            propertyId,
        },
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const stats = await prisma.review.aggregate({
        where: {
            propertyId,
        },
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
    });

    return {
        averageRating: stats._avg.rating ?? 0,
        totalReviews: stats._count.rating,
        reviews,
    };
};

const updateReview = async (
    reviewId: string,
    payload: IUpdateReview,
    tenantId: string
) => {
    const { rating, comment } = payload;

    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Review not found."
        );
    }

    if (review.tenantId !== tenantId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to update this review."
        );
    }

    const updateData: Prisma.ReviewUpdateInput = {};

    if (rating !== undefined) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Rating must be an integer between 1 and 5."
            );
        }

        updateData.rating = rating;
    }

    if (comment !== undefined) {
        const trimmedComment = comment.trim();

        if (!trimmedComment) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Comment cannot be empty."
            );
        }

        updateData.comment = trimmedComment;
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: updateData,
        include: {
            tenant: {
                omit: {
                    password: true,
                },
            },
            property: true,
        },
    });

    return updatedReview;
};

const deleteReview = async (
    reviewId: string,
    user: JwtPayload
) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Review not found."
        );
    }

    if (
        user.role !== UserRole.ADMIN &&
        review.tenantId !== user.id
    ) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to delete this review."
        );
    }

    await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });

    return null;
};


export const reviewServices = {
    createReview,
    getReviewsByProperty,
    updateReview,
    deleteReview,
}