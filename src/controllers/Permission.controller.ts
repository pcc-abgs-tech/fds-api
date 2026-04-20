import DB from "../config/database"
import PermissionService from "../services/Permission.service"
import { tryCatch } from "../utils/try-catch"

const tryCatchHandler = tryCatch(DB)

const get = tryCatchHandler(async (request, response) => {
    
    return response.status(200).send()
})

const getAll = tryCatchHandler(async (request, response) => {
    const page = parseInt(String(request.query.page)) || 1
    const limit = parseInt(String(request.query.limit)) || 25

    const fetchedPermissions = await PermissionService.getAll({ page, limit})
    
    return response.status(200).json({
        status: "success",
        data: fetchedPermissions.data,
        meta: fetchedPermissions.meta
    })
})

const create = tryCatchHandler(async (request, response) => {
    const { resource, action } = request.body

    const permission = await PermissionService.create(resource, action)
    
    return response.status(200).send({
        status: "success",
        message: "", // **Give standard message for successful insert or create
        data: permission,
        meta: null
    })
})

export default {
    get,
    getAll,
    create
}