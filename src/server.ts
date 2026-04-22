import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import DB from "./config/database"
import router from "./config/routes"
import { HOST, PORT } from "./config/server"
import { ErrorHandler } from "./middlewares/error.middleware"
import cors from "cors"

dotenv.config()

const app = express()

const init = async () => {
    try {
        await DB.authenticate()
        await DB.sync()

        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())

        app.use(cors({
            origin: [
                String(process.env.APP_URL),
                String(process.env.APP_URL_LOCAL)
            ],
            credentials: true,
            optionsSuccessStatus: 200
        }))

        app.use("/", router)

        app.use(ErrorHandler)

        app.listen(PORT, () => {
            console.log(`\x1b[32m[ READY ]\x1b[0m http://${HOST}:${PORT}`)
        })
    } catch (error) {
        console.error(`\x1b[31m[ ERROR ]\x1b[0m`)
    }
}

init()