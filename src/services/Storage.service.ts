import fsp from "fs/promises"
import { safeJoin } from "../utils/path"

const createDirectory = async (relativePath: string, folder_id: string) => {
    const fullPath = safeJoin(relativePath, folder_id)

    return await fsp.mkdir(fullPath, { recursive: true })
}

export default  {
    createDirectory
}