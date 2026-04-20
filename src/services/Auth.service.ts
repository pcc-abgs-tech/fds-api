import { v4 as uuidv4 } from "uuid"
import { verify } from "../helpers/password"
import { model } from "../models"
import { HttpError } from "../utils/http-error"
import { generateAccessToken, generateRefreshToken } from "../helpers/auth"
import SessionService from "./Session.service"
import { User } from "../interfaces/user.interface"
import moment from "moment-timezone"

const get = async (user_id: string) => {
    const fetchedUser = await model.user.findOne({
        attributes: [
            "UserID",
            "Username",
            "Name",
            "LastLoginAt"
        ],
        include: [
            {
                model: model.role,
                as: "role"
            },
            {
                model: model.entity,
                as: "entity",
                attributes: [
                    "EntityID",
                    "Name",
                    "DirectoryPath"
                ]
            }
        ],
        where: {
            UserID: user_id
        }
    })

    if (!fetchedUser) {
        throw new HttpError("User not found.", 404, "USER_NOT_FOUND")
    }

    return fetchedUser
}

const login = async (username: string, password: string) => {
    const fetchedUser = await model.user.findOne({
        attributes: [
            "UserID",
            "Username",
            "Password",
            "Name",
            "CreatedAt",
            "ModifiedAt",
            "LastLoginAt"
        ],
        include: [
            {
                model: model.role,
                as: "role",
                attributes: [
                    "RoleID",
                    "Description"
                ]
            },
            {
                model: model.entity,
                as: "entity",
                required: false,
                attributes: [
                    "EntityID",
                    "Name",
                    "DirectoryPath"
                ]
            }
        ],
        where: {
            Username: username
        }
    })

    if (!fetchedUser) {
        throw new HttpError("Incorrect username or password.", 401, "INVALID_CREDENTIALS")
    }

    const user = fetchedUser.get({ plain: true }) as User

    // Check if password is matched
    const isPasswordMatch = await verify(password, user.Password)
    if (!isPasswordMatch) {
        throw new HttpError("Incorrect username or password.", 401, "INVALID_CREDENTIALS")
    }

    const sessionID = uuidv4()
    const sessionExpiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString()

    // Generate Access and Refresh Tokens
    const [token, refreshToken] = await Promise.all([
        generateAccessToken(user.UserID, user.role.RoleID),
        generateRefreshToken(user.UserID, sessionID)
    ])

    // Create User Session
    await SessionService.create({
        session_id: sessionID,
        user_id: user.UserID,
        role_id: user.role.RoleID,
        refresh_token: refreshToken,
        expires_at: sessionExpiresAt
    })

    await fetchedUser.update({
        LastLoginAt: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")
    })

    return {
        user: user,
        token: token,
        refresh_token: refreshToken
    }
}

export default {
    get,
    login
}