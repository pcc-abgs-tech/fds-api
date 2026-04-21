import { DataTypes } from "sequelize";
import DB from "../config/database";
import { model } from ".";

export const Folder = DB.define("folders", {
    FolderID: {
        type: DataTypes.STRING(55),
        primaryKey: true
    },
    ParentID: {
        type: DataTypes.STRING(55),
    },
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