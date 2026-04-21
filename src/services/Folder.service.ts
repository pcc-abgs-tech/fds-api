import fs from "fs"
import moment from "moment-timezone";
import { Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";
// import { v7 as uuidv7 } from "uuid";
import { model } from "../models";
import { HttpError } from "../utils/http-error";
import StorageService from "./Storage.service";
import { safeJoin } from "../utils/path";
import fsp from "fs/promises";

type FolderCreationData = {
    parent_id: string | null;
    name:  string;
}

const get = async (id: string | null, transaction: Transaction) => {
    if (id === null) {
        const folders = await model.folder.findAll({
            where: {
                ParentID: null
            }
        })
        const files = await model.file.findAll({
            where: {
                FolderID: null
            }
        })

        return { folders, files }
    }

    // const folder = await model.folder.findAll({
    //     where: {
    //         ParentID: id
    //     },
    //     include: [
    //         {
    //             model: model.folder,
    //             as: "folders",
    //             // attributes: [
    //             //     "FolderID",
    //             //     "Name",
    //             //     "Path",
    //             //     "CreatedAt",
    //             //     "ModifiedAt"
    //             // ]
    //         },
    //         // {
    //         //     model: model.file,
    //         //     as: "files",
    //         //     attributes: [
    //         //         "FileID",
    //         //         "Name",
    //         //         "MimeType",
    //         //         "Size",
    //         //         "Path",
    //         //         "CreatedAt",
    //         //         "ModifiedAt"
    //         //     ]
    //         // }
    //     ]
    // })

    // if (!folder) {
    //     throw new HttpError("Cannot find folder.", 404, "FOLDER_NOT_FOUND")
    // }
    const folders = await model.folder.findAll({
        where: {
            ParentID: id
        }
    })

    const files = await model.file.findAll({
        where: {
            FolderID: id
        }
    })

    return { folders, files }
}

interface Folder {
    FolderID: string;
    ParentID: string;
    Name: string;
    Path: string;
    CreatedAt: Date;
    ModifiedAt: Date | null;
}

const create = async (data: FolderCreationData, transaction: Transaction) => {
    const folderExists = await model.folder.findOne({
        where: {
            Name: data.name,
            ParentID: data.parent_id
        }, transaction
    })

    if (folderExists) {
        throw new HttpError("Folder already exists in this directory.", 409, "FOLDER_ALREADY_EXIST")
    }

    let parentPath = ""
    if (data.parent_id !== null) {
        const parentFolder = await model.folder.findOne({
            where: {
                FolderID: data.parent_id
            }, transaction
        }) as unknown as Folder

        if (!parentFolder) {
            throw new HttpError("Failed to find parent folder.", 404, "PARENT_FOLDER_NOT_FOUND")
        }

        // parentPath = parentFolder.get("Path") + "/" + data.parent_id
        // parentPath = data.parent_id
        parentPath = parentFolder.Path ? parentFolder.Path + "/" + data.parent_id : data.parent_id
    }

    const folder = await model.folder.create({
        // FolderID: uuidv7()
        FolderID: uuidv4(),
        ParentID: data.parent_id,
        Name: data.name,
        Path: parentPath ?? null,
        CreatedAt: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")
    }, { transaction })

    if (!folder) {
        throw new HttpError("Failed to create folder.", 400, "FOLDER_CREATION_FAILED")
    }

    await StorageService.createDirectory(parentPath, String(folder.get("FolderID")))

    return folder
}

const getPath = async (id: string, transaction: Transaction) => {
    const fetchedFolder = await model.folder.findByPk(id, {
        attributes: [
            "FolderID",
            "ParentID",
            "Path"
        ],
        transaction
    })

    if (!fetchedFolder) {
        throw new HttpError("Folder not found.", 404, "FOLDER_NOT_FOUND")
    }

    const folder = fetchedFolder.get({ plain: true }) as Folder
    return folder.Path ? folder.Path + "/" + folder.FolderID : folder.FolderID
}

const download = async (id: string, transaction: Transaction) => {
    const fetchedFolder = await model.folder.findByPk(id, { transaction })

    if (!fetchedFolder) throw new HttpError("Folder not found.", 404, "FOLDER_NOT_FOUND")

    const folder = fetchedFolder.get({ plain: true })
    const { files, missingFiles } = await verifyFolderContents(folder.FolderID, transaction)
    if (missingFiles.length > 0) {
        throw new HttpError("Some files are missing on disk.", 401, "FILES_MISSING_ON_DISK")
    }

    const folderPath = safeJoin(folder.Path, folder.FolderID)
    if (!fs.existsSync(folderPath)) {
        throw new HttpError("Folder not found on disk.", 404, "FOLDER_MISSING_ON_DISK")
    }

    return {
        folder: folder,
        folder_path: folderPath,
        content: {
            folder: folder,
            files: files
        }
    }
}

interface File {
    FileID: string;
    FolderID: string | null;
    Name: string;
    MimeType: string;
    Size: number;
    Path: string;
    CreatedAt?: Date,
    ModifiedAt?: Date
}

const verifyFolderContents = async (id: string, transaction: Transaction) => {
    const files = await model.file.findAll({
        where: {
            FolderID: id
        },
        transaction
    }) as unknown as File[]

    const missingFiles: string[] = []
    for (const file of files) {
        const filePath = safeJoin(file.Path, file.FileID)

        if (!fs.existsSync(filePath)) {
            missingFiles.push(`${file.FileID} (${file.Name})`)
        }
    }

    return { files, missingFiles }
}

const getAll = async () => {
    return await model.folder.findAll() as unknown as Folder[]
}

const destroy = async (folder_id: string, transaction: Transaction) => {
    const fetchedFolder = await model.folder.findByPk(folder_id, {
        transaction
    })

    if (!fetchedFolder) throw new HttpError("Folder not found.", 404, "FOLDER_NOT_FOUND")

    const folder = fetchedFolder.get({ plain: true }) as Folder
    const folderPath = safeJoin(folder.Path, folder_id)

    // await fetchedFolder.destroy({ transaction })
    // await fsp.rm(folderPath, { recursive: true })
}

export default {
    get,
    getPath,
    create,
    download,
    getAll,
    destroy
}