import { NextFunction, Request, Response } from "express"
import { HttpError } from "../utils/http-error"
import RoleService from "../services/Role.service"

interface AuthenticatedRequest extends Request {
    user?: {
        id: string,
        role_id: number
    }
}

export const Authorize = (permission: string) => {
    return (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const user = request.user

            if (!user) {
                throw new HttpError("Unauthorized.", 401, "UNAUTHORIZE")
            }

            // const permissions = RoleService.getPermissions(user.role_id)
        } catch (error) {

        }
    }
}