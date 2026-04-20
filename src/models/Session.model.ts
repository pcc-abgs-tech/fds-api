import { DataTypes } from "sequelize";
import DB from "../config/database";

export const Session = DB.define("sessions", {
    SessionID: {
        type: DataTypes.STRING(55),
        primaryKey: true
    },
    UserID: {
        type: DataTypes.STRING(55),
    },
    Token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LastActiveAt: DataTypes.DATE,
    CreatedAt: DataTypes.DATE,
    ExpiresAt: DataTypes.DATE,
    IsRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    indexes: [
        {
            fields: [
                "SessionID",
                "UserID"
            ]
        }
    ],
    timestamps: false
})