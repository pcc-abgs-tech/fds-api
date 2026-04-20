import { DataTypes } from "sequelize";
import DB from "../config/database";

export const Role = DB.define("roles", {
    RoleID: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true
    },
    Description: {
        type: DataTypes.STRING(55),
        unique: true
    }
}, {
    indexes: [
        {
            fields: [
                "RoleID",
                "Description"
            ]
        }
    ],
    timestamps: false
})