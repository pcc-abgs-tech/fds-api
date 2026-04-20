import DB from "../config/database"
import { model } from "../models"
import RoleService from "../services/Role.service"
import { HttpError } from "../utils/http-error"
import { tryCatch } from "../utils/try-catch"

const tryCatchHandler = tryCatch(DB)

const get = tryCatchHandler(async (request, response) => {
    
    return response.status(200).send()
})

const getPermissions = tryCatchHandler(async (request, response) => {
    const id = parseInt(String(request.params.id))
    const fetchedRolePermissions = await RoleService.getPermissions(id)
    
    return response.status(200).send(fetchedRolePermissions)
})

// const getPermissions = tryCatchHandler(async (request, response) => {
    
//     return response.status(200).send()
// })

const create = tryCatchHandler(async (request, response) => {
    const { description } = request.body

    const createdRole = await RoleService.create(description)

    if (!createdRole) {
        throw new HttpError("Failed to create user role.", 400, "ROLE_CREATION_FAILED")
    }

    return response.status(200).send(createdRole)
})

export default {
    get, 
    // getAll,
    getPermissions,
    create
}