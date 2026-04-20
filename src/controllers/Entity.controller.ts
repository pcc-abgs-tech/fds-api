import DB from "../config/database"
import EntityService from "../services/Entity.service"
import { tryCatch } from "../utils/try-catch"

const tryCatchHandler = tryCatch(DB)

const get = tryCatchHandler(async (request, response) => {
    const id = request.params.id

    return response.status(200).send()
})

const getAll = tryCatchHandler(async (request, response) => {
    
    return response.status(200).send()
})

const create = tryCatchHandler(async (request, response, next, transaction) => {
    const { type, name, description, address, directory_path } = request.body

    await EntityService.create({
        type,
        name,
        description,
        address,
        directory_path
    }, transaction)

    return response.status(200).send()
})

const update = tryCatchHandler(async (request, response) => {
    return response.status(200).send()
})

export default {
    get,
    getAll,
    create
}