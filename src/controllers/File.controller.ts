import fs from "fs"
import multer from "multer"
import DB from "../config/database"
import { tryCatch } from "../utils/try-catch"
import { BASE_DIR } from "../config/storage"
import FileService from "../services/File.service"
import { HttpError } from "../utils/http-error"

export const storage = multer({ dest: BASE_DIR })

const tryCatchHandler = tryCatch(DB)

const getAll = tryCatchHandler(async (request, response) => {
    const files = await FileService.getAll()
    
    return response.status(200).send(files)
})

const upload = tryCatchHandler(async (request, response, next, transaction) => {
    const files = request.files
    const folder_id = String(request.params.id)

    if (!Array.isArray(files) || files.length === 0) {
        throw new HttpError("No file uploaded.", 400, "FILE_UPLOAD_EMPTY")
    }

    await FileService.upload({ folder_id, files }, transaction) // files may be undefined so it cannot accept it

    return response.status(204).send()
})

const download = tryCatchHandler(async (request, response) => {
    const id = String(request.params.id)
    const file = await FileService.download(id)

    response.setHeader("Content-Type", file.mime_type)
    response.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(file.name)}`)
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition")

    const stream = fs.createReadStream(file.path)
    stream.pipe(response)
})

const destroy = tryCatchHandler(async (request, response, next, transaction) => {
    const id = String(request.params.id)

    const x = await FileService.destroy(id, transaction)
    
    return response.status(200).json({
        status: "success",
        message: "File has been moved to trash."
    })
})

export default {
    getAll,
    upload,
    download,
    destroy
}