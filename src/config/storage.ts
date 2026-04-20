import dotenv from "dotenv";
import path from "path";

dotenv.config()

export const BASE_DIR = path.resolve(
    process.cwd(),
    String(process.env.STORAGE_DIR) ?? "storage"
)

// export const BASE_DIR = path.join(__dirname, "../../storage")