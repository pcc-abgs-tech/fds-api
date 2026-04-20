import jwt from "jsonwebtoken"
import DB from "../config/database"
import AuthService from "../services/Auth.service"
import { tryCatch } from "../utils/try-catch"
import { HttpError } from "../utils/http-error"
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/server"
import { parseBase64Key } from "../helpers/auth"
import SessionService from "../services/Session.service"

const tryCatchHandler = tryCatch(DB)

const getCurrentUser = tryCatchHandler(async (request, response) => {
    const token = request.cookies["token"]
    const refreshToken = request.cookies["refresh-token"]

    // Checks if access token is active
    if (!token) {
        throw new HttpError("Invalid token.", 401, "INVALID_ACCESS_TOKEN")
    }
    
    // Decode JWT payload
    const decoded = jwt.verify(token, parseBase64Key(ACCESS_TOKEN_SECRET)) as { user_id: string }
    const user = await AuthService.get(decoded.user_id)

    return response.status(200).send({
        status: "success",
        message: "Active Authenticated User",
        data: user
    })
})

const login = tryCatchHandler(async (request, response) => {
    const { username, password } = request.body

    const { user, token, refresh_token } = await AuthService.login(username, password)
    
    response.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })

    response.cookie("refresh-token", refresh_token, {
        httpOnly: true,
        secure: false, // ** 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return response.status(200).send({
        status: "success",
        message: "Login successfully.",
        data: user,
        meta: null
    })
})

const logout = tryCatchHandler(async (request, response) => {
    const refreshToken = request.cookies["refresh-token"]

    // Checks if refresh token is active
    if (!refreshToken) {
        throw new HttpError("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN")
    }

    // Decode JWT payload for refresh token
    const decoded = jwt.verify(refreshToken, parseBase64Key(REFRESH_TOKEN_SECRET)) as { user_id: string, session_id: string }
    const session = await SessionService.get(decoded.session_id)

    if (!session) {
        throw new HttpError("Invalid session.", 401, "INVALID_SESSION")
    }

    if (new Date(session.ExpiresAt) < new Date() || session.IsRevoked) {
        throw new HttpError("Session has expired or has been revoked.", 401, "SESSION_EXPIRED")
    }

    response.clearCookie("token")
    response.clearCookie("refresh-token")
    
    return response.status(204).send()
})

export default {
    getCurrentUser,
    login,
    logout
}