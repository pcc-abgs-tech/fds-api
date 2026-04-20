import moment from "moment-timezone"
import { model } from "../models";
import { Session } from "../interfaces/session.interface";
import { HttpError } from "../utils/http-error";
import { Pagination } from "../interfaces/pagination.interface";

type SessionCreationData = {
    session_id: string;
    user_id: string;
    role_id: number;
    refresh_token: string;
    expires_at: string;
}

const create = async (data: SessionCreationData): Promise<Session> => {
    const currentDate = moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")
    
    const createdSession = await model.session.create({
        SessionID: data.session_id,
        UserID: data.user_id,
        Token: data.refresh_token,
        LastActiveAt: currentDate,
        CreatedAt: currentDate,
        ExpiresAt: data.expires_at
    })

    if (!createdSession) {
        throw new HttpError("Failed to create user session.", 500, "SESSION_CREATION_FAILED")
    }

    return createdSession.get({ plain: true }) as Session
}

const get = async (session_id: string): Promise<Session> => {
    const fetchedSession = await model.session.findOne({
        where: {
            SessionID: session_id
        }
    })

    if (!fetchedSession) {
        throw new HttpError("Session not found.", 404, "SESSION_NOT_FOUND")
    }

    return fetchedSession.get({ plain: true }) as Session
}

const getAll = async (pagination: Pagination, search?: string) => {
    const page = pagination.page || 1
    const limit = pagination.limit || 25
    const offset = (page - 1) * limit

    const fetchedSessions = await model.session.findAndCountAll({
        limit,
        offset,
        order: [
            ["CreatedAt", "DESC"]
        ]
    })

    return {
        data: fetchedSessions.rows.map(row => row.get({ plain: true }) as Session),
        meta: {
            page,
            limit,
            total: fetchedSessions.count,
            total_pages: Math.ceil(fetchedSessions.count / limit)
        }
    }
}

const updateLastActiveAt = async (session_id: string) => {
    const fetchedSession = await model.session.findOne({
        where: {
            SessionID: session_id
        }
    })

    if (!fetchedSession) {
        throw new HttpError("Session does not exists.", 404, "SESSION_NOT_FOUND")
    }

    const updatedSession = await fetchedSession.update({
        LastActiveAt: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")
    })

    if (!updatedSession) {
        throw new HttpError("Session update failed.", 500, "SESSION_UPDATE_FAILED")
    }

    return updatedSession.get({ plain: true }) as Session
}

const revoke = async (session_id: string) => {
    const fetchedSession = await model.session.findOne({
        where: {
            SessionID: session_id
        }
    })

    if (!fetchedSession) {
        throw new HttpError("Session not found.", 404, "SESSION_NOT_FOUND")
    }

    await fetchedSession.update({
        IsRevoke: true
    })
}

export default {
    create,
    get,
    getAll,
    updateLastActiveAt,
    revoke
}