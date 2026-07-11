import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { prisma } from "../lib/prisma";
import AppError from "../errors/AppError";


export const auth = (...requiredRoles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization.split(" ")[1]
                :
                req.headers.authorization

        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "You are not authorized."
            );
        }
        const verifiedToken = jwtUtils.verifyToken(token);

        if (!verifiedToken.success) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                verifiedToken.error
            );
        }

        const { id, role } = verifiedToken.data as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                "User not found."
            );
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "Your account has been banned."
            );
        }

        if (
            requiredRoles.length &&
            !requiredRoles.includes(role)
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are forbidden to access this resource."
            );
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
        next();
    })
}