import { Entity } from "./Entity.model";
import { File } from "./File.model";
import { Folder } from "./Folder.model";
import { Permission } from "./Permission.model";
import { Role } from "./Role.model";
import { RolePermission } from "./RolePermission.model";
import { Session } from "./Session.model";
import { User } from "./User.model";

RolePermission.removeAttribute("id")

Entity.hasMany(User, {
    foreignKey: "EntityID",
    as: "users"
})

User.belongsTo(Entity, {
    foreignKey: "EntityID",
    as: "entity"
})

User.belongsTo(Role, {
    foreignKey: "RoleID",
    as: "role"
})

Role.hasMany(User, {
    foreignKey: "RoleID"
})

Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "RoleID"
})

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "PermissionID"
})

Folder.hasMany(Folder, {
    foreignKey: "ParentID",
    as: "folders",
    onDelete: "CASCADE",
    hooks: true
})

Folder.belongsTo(Folder, {
    foreignKey: "ParentID",
    as: "parent"
})

Folder.hasMany(File, {
    foreignKey: "FolderID",
    as: "files",
    onDelete: "CASCADE",
    hooks: true
})

File.belongsTo(Folder, {
    foreignKey: "FolderID",
    as: "folder"
})

export const model = {
    folder: Folder,
    file: File,
    user: User,
    entity: Entity,
    role: Role,
    permission: Permission,
    role_permission: RolePermission,
    session: Session
}