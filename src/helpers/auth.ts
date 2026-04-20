import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/server";

export const generateAccessToken = async (user_id: string, role_id: number): Promise<string> => {
    const options: jwt.SignOptions = {
        expiresIn: 900
    }

    return jwt.sign({ user_id, role_id }, parseBase64Key(ACCESS_TOKEN_SECRET), options)
}

export const generateRefreshToken = async (user_id: string, session_id: string): Promise<string> => {
    const options: jwt.SignOptions = {
        expiresIn: "7d"
    }
    
    return jwt.sign({ user_id, session_id }, parseBase64Key(REFRESH_TOKEN_SECRET), options)
}

export const parseBase64Key = (base64_key: string) => {
    return base64_key.startsWith("base64:") ? Buffer.from(base64_key.slice(7), "base64") : Buffer.from(base64_key)
}