import archiver from "archiver"
import DB from "../config/database"
import FolderService from "../services/Folder.service"
import { tryCatch } from "../utils/try-catch"
import fs from "fs"
import path from "path"
import { arch } from "os"
import FileService from "../services/File.service"

const tryCatchHandler = tryCatch(DB)

const get = tryCatchHandler(async (request, response, next, transaction) => {
    const folderID = String(request.params.id) !== "root" ? String(request.params.id) : null
    // const id = request.params.id ? String(request.params.id) : "root"

    const directory = await FolderService.get(folderID, transaction)
    return response.status(200).send({
        status: "success",
        data: directory
    })
})

const getAll = tryCatchHandler(async (request, response) => {
    
    return response.status(200).send()
})

const getAllByParentFolder = tryCatchHandler(async (request, response) => {
    const parentFolderID = String(request.params.id)


    
    return response.status(200).send()
})

const create = tryCatchHandler(async (request, response, next, transaction) => {
    const { parent_id, name } = request.body

    const x = await FolderService.create({ parent_id, name }, transaction)
    
    return response.status(200).send(x)
})

const download = tryCatchHandler(async (request, response, next, transaction) => {
    const id = String(request.params.id)

    const { folder, folder_path, content } = await FolderService.download(id, transaction)
    const zip = `${folder.Name || folder.FolderID}.zip`

    response.setHeader("Content-Type", "application/zip")
    response.setHeader("Content-Disposition", `attachment; filename=${zip}`)
    response.setHeader("Access-Control-Expose-Headers", "Content-Disposition")

    const archive = archiver("zip", { zlib: { level: 9 }})
    archive.on("error", (error) => { throw new Error("Error:" + error) })
    archive.pipe(response)

    // console.log("Zipping:", folder_path)
    // console.log("Exsists:", fs.existsSync(folder_path))
    // console.log("Contents", fs.readdirSync(folder_path))
    // return response.status(200).send(folder.Name)
    // archive.directory(folder_path, folder.Name || folder.FolderID)

    const folders = await FolderService.getAll()
    const folderNameMap = new Map<string, string>()
    for (const folder of folders) {
        folderNameMap.set(folder.FolderID, folder.Name)
    }

    const files = await FileService.getAll()
    const fileNameMap = new Map<string, string>()
    // for (const file of content.files) {
    //     fileNameMap.set(file.FileID, file.Name)
    // }
    for (const file of files) {
        fileNameMap.set(file.FileID, file.Name)
    }

    const addFolderToZip = (currentPath: string, zipPath: string) => {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true })

        console.log("Folder Items:", entries)

        archive.append("", { name: `${zipPath}/` })

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name)

            const friendlyName = folderNameMap.get(entry.name) || fileNameMap.get(entry.name) || entry.name
            const entryZipPath = path.posix.join(zipPath, friendlyName)

            if (entry.isDirectory()) {
                addFolderToZip(fullPath, entryZipPath)
            } else {
                archive.file(fullPath, { name: entryZipPath })
                console.log("[ZIP File]:", {
                    "Full Path": fullPath,
                    "Entry ZIP Path": entryZipPath
                })
            }

            // const itemsMap = new Map<string, string>()
            // if (entry.isDirectory()) {
            //     const folders = await FolderService.getAll()
            // } else {

            // }
        }
    }

    addFolderToZip(folder_path, folder.Name);

    archive.append(
        JSON.stringify(content.files, null, 2),
        { name: "_manifest.json" } 
    )

    await archive.finalize()
})

export default {
    get,
    getAll,
    create,
    download
}