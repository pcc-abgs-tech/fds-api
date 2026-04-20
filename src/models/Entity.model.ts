import { DataTypes } from "sequelize";
import DB from "../config/database";

export const Entity = DB.define("entities", {
    EntityID: {
        type: DataTypes.STRING(55),
        primaryKey: true
    },
    Type: DataTypes.STRING(25),
    Name: {
        type: DataTypes.STRING,
        unique: true
    },
    Description: DataTypes.STRING,
    Address: DataTypes.STRING,
    DirectoryPath: DataTypes.STRING,
},{
    indexes: [
        {
            fields: [
                "EntityID",
                "Name",
                "Type"
            ]
        }
    ],
    timestamps: false
})