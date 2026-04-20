import path from "path"
import { BASE_DIR } from "../config/storage"

export const safeJoin = (...paths: string[]) => {
    const resolvedPath = path.resolve(BASE_DIR, ...paths)
    const relativePath = path.relative(BASE_DIR, resolvedPath)

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error("Path traversal detected.")
    }

    console.log("Paths:", paths)

    return resolvedPath
}