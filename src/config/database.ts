import dotenv from "dotenv"
import { Sequelize } from "sequelize"

dotenv.config()

const DB_NAME = String(process.env.DB_NAME)
const DB_USER = String(process.env.DB_USER)
const DB_PASS = String(process.env.DB_PASS)

const DB = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASS,
    {
        host: "localhost",
        dialect: "mysql",
        logging: false,
        timezone: "+08:00"
    }
)

export default DB