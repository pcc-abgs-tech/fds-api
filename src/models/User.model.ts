import { DataTypes } from "sequelize";
import DB from "../config/database";
import { Entity } from "./Entity.model";

export const User = DB.define("users", {
    UserID: {
        type: DataTypes.STRING(55),
        primaryKey: true
    },
    Username: {
        type: DataTypes.STRING(25),
        unique: true
    },
    Password: DataTypes.STRING,
    EntityID: {
        type: DataTypes.STRING(55),
        references: {
            model: Entity,
            key: "EntityID"
        }
    },
    Name: DataTypes.STRING,
    RoleID: DataTypes.TINYINT,
    CreatedAt: DataTypes.DATE,
    ModifiedAt: DataTypes.DATE,
    LastLoginAt: DataTypes.DATE
}, {
    indexes: [
        {
            fields: [
                "UserID",
                "Username"
            ]
        }
    ],
    timestamps: false
})