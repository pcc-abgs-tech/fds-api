import dotenv from "dotenv"
import { parseBase64Key } from "../helpers/auth"

dotenv.config()

export const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_KEY)
export const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_KEY)

export const HOST = process.env.HOST || "localhost"
export const PORT = process.env.PORT ? Number(process.env.PORT) : 3069

export const NODE_ENV = String(process.env.NODE_ENV)