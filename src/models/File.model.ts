import { DataTypes } from "sequelize";
import DB from "../config/database";

export const File = DB.define("files", {
    FileID: {
        type: DataTypes.STRING(55),
        primaryKey: true
    },
    FolderID: DataTypes.STRING(55),
    Name: DataTypes.STRING,
    MimeType: DataTypes.STRING,
    Size: DataTypes.INTEGER,
    Path: DataTypes.STRING,
    CreatedAt: DataTypes.DATE,
    ModifiedAt: DataTypes.DATE
}, {
    indexes: [
        {
            fields: [
                "FileID",
                "FolderID",
                "Name"
            ]
        }
    ],
    timestamps: false
})