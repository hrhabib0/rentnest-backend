import { Response } from "express";

interface IResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const sendResponse = <T>(res: Response, payload: IResponse<T>) => {
    const { statusCode, success, message, data, meta } = payload;

    res.status(statusCode).json({
        success,
        statusCode,
        message,
        meta,
        data
    });
};

export default sendResponse;