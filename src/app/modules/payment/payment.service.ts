import { PaymentProvider, PaymentStatus, RentalRequestStatus } from "../../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { stripe } from "../../lib/stripe";
import config from "../../config";

const createPaymentIntent = async (rentalRequestId: string, tenantId: string) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: rentalRequestId,
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

    if (rentalRequest.tenantId !== tenantId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to pay for this rental request."
        );
    }

    if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Rental request is not approved yet."
        );
    }

    const existingPayment = await prisma.payment.findUnique({
        where: {
            rentalRequestId,
        },
    });

    if (existingPayment) {
        throw new AppError(
            httpStatus.CONFLICT,
            "Payment already exists."
        );
    }

    const amount = Number(rentalRequest.property.monthlyRent);

    if (isNaN(amount) || amount <= 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Invalid payment amount."
        );
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: rentalRequest.property.title,
                        description: rentalRequest.property.description,
                    },
                    unit_amount: Math.round(amount * 100),
                },
            },
        ],

        success_url: `${config.frontend_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${config.frontend_url}/payment-cancel`,

        metadata: {
            rentalRequestId,
            tenantId,
        },
    });
    await prisma.payment.create({
        data: {
            rentalRequestId,
            amount,
            transactionId: session.id,
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.PENDING,
        },
    });

    return {
        checkoutUrl: session.url,
        sessionId: session.id,
    };
};

const handleStripeWebhook = async (payload: Buffer, signature: string) => {

    if (!signature) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Stripe signature is missing."
        );
    }

    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
    );

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;

            await prisma.payment.update({
                where: {
                    transactionId: session.id,
                },
                data: {
                    status: PaymentStatus.PAID,
                    paidAt: new Date(),
                },
            });

            break;
        }

        default:
            console.log(`Unhandled event: ${event.type}`);
    }

    // res.status(200).json({
    //     received: true,
    // });
};


export const paymentServices = {
    createPaymentIntent,
    handleStripeWebhook,
}