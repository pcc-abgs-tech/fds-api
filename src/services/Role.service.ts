import { model } from "../models"
import { HttpError } from "../utils/http-error"

const getPermissions = async (role_id: number) => {
    const fetchedRolePermissions = await model.role.findOne({
        include: [
            {
                model: model.permission,
                as: "permissions"
            }
        ],
        where: {
            RoleID: role_id
        }
    })

    if (!fetchedRolePermissions) {
        throw new HttpError("Role not found.", 404, "ROLE_NOT_FOUND")
    }

    return fetchedRolePermissions
}

const create = async (description: string) => {
    return await model.role.create({
        Description: description
    })
}

export default {
    getPermissions,
    create
}