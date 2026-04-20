export type EntityTypes = "NHQ" | "RC"

export interface Entity {
    EntityID?: string;
    Type?: EntityTypes;
    Name: string;
    Description?: string;
    Address?: string;
    DirectoryPath: string;
}