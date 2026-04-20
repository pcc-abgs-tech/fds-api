import DB from "../config/database"
import SessionService from "../services/Session.service"
import { tryCatch } from "../utils/try-catch"

const tryCatchHandler = tryCatch(DB)

const getAll = tryCatchHandler(async (request, response) => {
    const page = parseInt(String(request.query.page)) || 1
    const limit = parseInt(String(request.query.limit)) || 25
    const search = String(request.query.search)

    const sessions = await SessionService.getAll({ page, limit });
    
    return response.status(200).send({
        status: "success",
        data: sessions.data,
        meta: sessions.meta
    })
})

const revoke = tryCatchHandler(async (request, response) => {
    const id = String(request.params.id)

    await SessionService.revoke(id)

    return response.status(200).send({
        status: "success",
        message: "Session has been revoked.",
    })
})

export default {
    getAll,
    revoke
}