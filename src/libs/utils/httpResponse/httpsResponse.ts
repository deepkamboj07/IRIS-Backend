import { Request, Response } from "express"
import { THttpResponse } from "./apiResponse"

export default (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown
): void => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    }

    res.status(responseStatusCode).json(response)
}