import { Response } from "express";

interface IResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data?: T;
}

const sendResponse = <T>(res: Response, payload: IResponse<T>) => {
    const { statusCode, success, message, data } = payload;

    res.status(statusCode).json({
        success,
        statusCode,
        message,
        data,
    });
};

export default sendResponse;