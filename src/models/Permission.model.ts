import { DataTypes } from "sequelize";
import DB from "../config/database";

export const Permission = DB.define("permissions", {
    PermissionID: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true
    },
    Resource: DataTypes.STRING(15),
    Action: DataTypes.STRING(15)
}, {
    indexes: [
        {
            unique: true,
            fields: [
                "Resource",
                "Action"
            ]
        }
    ],
    timestamps: false
})