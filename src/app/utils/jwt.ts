import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '../config';

const generateToken = (payload: JwtPayload) => {
    const token = jwt.sign(payload, config.jwt_access_secret as string, {
        expiresIn: config.jwt_access_expires_in,
    } as SignOptions
    );
    return token;
}

const verifyToken = (token: string) => {

    try {
        const verifiedToken = jwt.verify(token, config.jwt_access_secret as string);
        return {
            success: true,
            data: verifiedToken
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message
        }
    }
}

export const jwtUtils = {
    generateToken,
    verifyToken
}