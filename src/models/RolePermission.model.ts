import { DataTypes } from "sequelize";
import DB from "../config/database";
import { Role } from "./Role.model";
import { Permission } from "./Permission.model";

export const RolePermission = DB.define("role_permissions", {
    RoleID: {
        type: DataTypes.TINYINT,
        references: {
            model: Role,
            key: "RoleID"
        }
    },
    PermissionID: {
        type: DataTypes.TINYINT,
        references: {
            model: Permission,
            key: "PermissionID"
        }
    }
}, {
    timestamps: false
})