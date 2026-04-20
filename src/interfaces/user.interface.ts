import { Entity } from "./entity.interface";

export interface Role {
    RoleID: number;
    Description: string;
    permissions: Permission[]
}

export interface Permission {
    PermissionID: number;
    Resource: string;
    Action: string;
}

export interface User {
    UserID: string;
    Username: string;
    Password: string;
    EntityID: string | null;
    Name: string;
    RoleID: string;
    CreatedAt: Date;
    ModifiedAt: Date | null;
    LastLoginAt: Date | null;
    role: Role;
    entity: Entity | null;
}