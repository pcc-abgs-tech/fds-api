import { Pagination } from "../interfaces/pagination.interface"
import { Permission } from "../interfaces/user.interface"
import { model } from "../models"
import { HttpError } from "../utils/http-error"

const create = async (resource: string, action: string) => {
    const createdPermission = await model.permission.create({
        Resource: resource,
        Action: action
    })
    
    if (!createdPermission) {
        throw new HttpError("Failed to create permission.", 500, "PERMISSION_CREATION_FAILED")
    }

    return createdPermission.get({ plain: true }) as Permission
}

const getAll = async (pagination: Pagination, search?: string) => {
    const page = pagination.page
    const limit =  pagination.limit
    const offset = (page - 1) * limit

    const fetchedPermissions = await model.permission.findAndCountAll({
        limit,
        offset 
    })

    return {
        data: fetchedPermissions.rows.map(row => row.get({ plain: true }) as Permission),
        meta: {
            page,
            limit,
            total: fetchedPermissions.count,
            totalPages: Math.ceil(fetchedPermissions.count / limit)
        }
    }
}

const get = async (id: number) => {
    const fetchedPermission = await model.permission.findOne({
        where: {
            PermissionID: id
        }
    })

    if (!fetchedPermission) {
        throw new HttpError("Permission not found.", 404, "PERMISSION_NOT_FOUND")
    }

    return fetchedPermission.get({ plain: true }) as Permission
}

export default {
    create,
    getAll,
    get
}