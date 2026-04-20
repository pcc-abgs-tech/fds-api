import DB from "../config/database"
import UserService from "../services/User.service"
import { HttpError } from "../utils/http-error"
import { tryCatch } from "../utils/try-catch"

const tryCatchHandler = tryCatch(DB)

const get = tryCatchHandler(async (request, response) => {
    const id = String(request.params.id)

    const user = await UserService.get(id)
    
    return response.status(200).send({
        status: "success",
        message: "User data has retrieved successfully.",
        data: user
    })
})

const getAll = tryCatchHandler(async (request, response) => {
    const page = parseInt(String(request.query.page)) || 1
    const limit = parseInt(String(request.query.limit)) || 25
    const search = String(request.query.search)
    const role_id = parseInt(String(request.query.rid))

    const { data, pagination } = await UserService.getAll({ role_id }, { page, limit }, search)
    
    // return response.status(200).send({
    //     status: "success",
    //     message: "XXXX",
    //     data: rows,
    //     meta: {
    //         pagination: {
    //             page: page,
    //             limit: limit,
    //             total: count,
    //             total_pages: Math.ceil(count / limit)
    //         }
    //     }
    // })

    return response.status(200).send({
        status: "success",
        message: "XXX",
        data: data,
        meta: {
            pagination
        }
    })
})

const create = tryCatchHandler(async (request, response) => {
    const { username, password, entity_id, role_id, name } = request.body

    const createdUser = await UserService.create({
        username,
        password,
        entity_id,
        role_id,
        name
    })
    
    return response.status(201).send()
})

export default {
    get,
    getAll,
    create
}