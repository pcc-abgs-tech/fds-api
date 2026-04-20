import { NextFunction, Request, Response } from "express"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { HttpError } from "../utils/http-error"
import { ACCESS_TOKEN_SECRET } from "../config/server"
import { parseBase64Key } from "../helpers/auth"

interface AuthenticatedRequest extends Request {
    user?: { user_id: string, role_id: number }
}

export const Authentication = (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
    try {
        const token = request.cookies["token"]

        if (!token) {
            throw new HttpError("Invalid token.", 401, "ACCESS_TOKEN_INVALID")
        }

        const decoded = jwt.verify(token, parseBase64Key(ACCESS_TOKEN_SECRET)) as { user_id: string, role_id: number }

        request.user = decoded
        next()
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return response.status(401).send("Invalid token.")
        }

        if (error instanceof TokenExpiredError) {
            return response.status(401).send("Token has expired.")
        }

        if (error instanceof HttpError) {
            return response.status(error.statusCode).send({ message: error.message })
        } else {
            return response.status(500).send({ message: "Invalid Server Error" })
        }
    }
}