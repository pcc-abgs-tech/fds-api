import { DataTypes } from "sequelize";
import DB from "../config/database";

export const Folder = DB.define("folders", {
    FolderID: {
        type: DataTypes.STRING(55),
        primaryKey: true
    },
    ParentID: DataTypes.STRING(55),
    Name: DataTypes.STRING,
    Path: DataTypes.STRING,
    CreatedAt: DataTypes.DATE,
    ModifiedAt: DataTypes.DATE
}, {
    indexes: [
        {
            fields: [
                "FolderID",
                "ParentID",
                "Name"
            ]
        }
    ],
    timestamps: false
})