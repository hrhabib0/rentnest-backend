import { UserRole } from "../../../../prisma/src/generated/prisma/enums";
import { REGISTER_ALLOWED_ROLES } from "../../constants/auth.contants";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/bcrypt";
import { IRegisterUser } from "./auth.interface";
import httpStatus from "http-status";

const registerUserIntoDB = async (payload: IRegisterUser) => {
    const { name, email, password, role } = payload;
    const normalizedName = name?.trim() ?? "";
    const normalizedEmail = email?.trim().toLowerCase() ?? "";
    const normalizedPassword = password?.trim() ?? "";
    if (
        !normalizedName ||
        !normalizedEmail ||
        !normalizedPassword ||
        !role
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "All fields are required."
        );
    }
    if (!REGISTER_ALLOWED_ROLES.includes(role)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Invalid user role."
        );
    }
    if (normalizedPassword.length < 6) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Password must be at least 6 characters."
        );
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: normalizedEmail
        }
    })

    if (isUserExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            "User already exists with this email."
        );
    }
    const hashedPassword = await hashPassword(normalizedPassword);
    const createdUser = await prisma.user.create({
        data: {
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            role
        },
        omit: {
            password: true
        }
    })

    return createdUser;

}

export const authServices = {
    registerUserIntoDB,
}