import { DateOnlyDataType, Transaction } from "sequelize";
import moment from "moment-timezone";
// import { v7 as uuidv7 } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { model } from "../models";
import FolderService from "./Folder.service";
import { HttpError } from "../utils/http-error";
import { safeJoin } from "../utils/path";
import fs from "fs"
import fsp from "fs/promises"
import { BASE_DIR } from "../config/storage";
import { Folder } from "../models/Folder.model";

type UploadData = {
    folder_id: string;
    files: Express.Multer.File[];
}

const upload = async (data: UploadData, transaction: Transaction) => {
    // Get the file folder path
    // const folderPath = await FolderService.getPath(data.folder_id, transaction)
    let folderPath: string

    // Check if file folder does exists
    // if (!folderPath) {
    //     throw new HttpError("Folder not found.", 404)
    // }
    if (data.folder_id === "root") {
        folderPath = ""
    } else {
        const resolvedPath = await FolderService.getPath(data.folder_id, transaction)

        if (!resolvedPath) {
            throw new HttpError("Folder not found.", 404, "FOLDER_NOT_FOUND")
        }

        folderPath = resolvedPath
    }
    
    const filesToUpload = data.files.map(file => ({
        // FileID: uuidv7(),
        FileID: uuidv4(),
        FolderID: data.folder_id === "root" ? null : data.folder_id,
        Name: file.originalname,
        MimeType: file.mimetype,
        Size: file.size,
        Path: folderPath,
        CreatedAt: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")
    }))

    const createdFiles = await model.file.bulkCreate(filesToUpload, { transaction })
    if (!createdFiles) {
        throw new HttpError("Failed to upload files.", 400, "FILE_UPLOAD_FAILED")
    }

    for (let i = 0; i < createdFiles.length; i++) {
        const file = createdFiles[i] // can be undefined
        const uploadedFile = data.files[i] // can be undefined

        if (!file || !uploadedFile) {
            throw new HttpError("Failed to retrieve file info.", 400, "FILE_UPLOAD_FAILED")
        }

        const fileID = String(file.get("FileID"))
        const filePath = safeJoin(folderPath.startsWith("/") ? folderPath.slice(1) : folderPath, fileID)

        // Debug
        console.log("Folder Path:", folderPath)
        // console.log("File Path:", filePath)

        await fsp.rename(uploadedFile.path, filePath)
    }
}

const download = async (id: string) => {
    const fetchedFile = await model.file.findByPk(id)
    
    if (!fetchedFile) {
        throw new HttpError("File not found.", 404, "FILE_NOT_FOUND")
    }

    const file = fetchedFile.get({ plain: true })
    const filePath = safeJoin(file.Path, file.FileID)

    if (!fs.existsSync(filePath)) {
        throw new HttpError("File missing on disk.", 410, "FILE_MISSING_ON_DISK")
    }

    return {
        name: file.Name,
        mime_type: file.MimeType,
        path: filePath
    }
}

// Delete File
const destroy = async (file_id: string, transaction: Transaction) => {
    // Fetch file info from database
    const fetchedFile = await model.file.findByPk(file_id, {
        attributes: [
            "Path"
        ],
        transaction
    })

    // Check if file does exists
    if (!fetchedFile) {
        throw new HttpError("File not found.", 404, "FILE_NOT_FOUND")
    }

    // Return fetched file as JSON
    const file = fetchedFile.get({ plain: true }) as File
    // File path
    const filePath = safeJoin(file.Path, file_id)
    
    // Remove file from the database
    await model.file.destroy({
        where: {
            FileID: file_id
        },
        transaction
    })
    // Unlink file from physical storage
    await fsp.unlink(filePath)
}

interface File {
    FileID: string;
    FolderID: string;
    Name: string;
    MimeType: string;
    Size: number;
    Path: string;
    CreatedAt: Date;
    ModifiedAt: Date | null;
}

const getAll = async () => {
    return await model.file.findAll() as unknown as File[]
}

export default {
    upload,
    download,
    destroy,
    getAll
}