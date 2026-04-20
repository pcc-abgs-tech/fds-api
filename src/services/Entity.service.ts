import { v4 as uuidv4 } from "uuid"
import { Transaction } from "sequelize"
import { model } from "../models"
import { HttpError } from "../utils/http-error";
import { Entity } from "../interfaces/entity.interface";

type EntityCreationData = {
    type: "center" | "nhq";
    name: string;
    description: string;
    address: string;
    directory_path: string | null
}

const generateID = () => {

}

const create = async (data: EntityCreationData, transaction: Transaction) => {
    const createdEntity = await model.entity.create({
        EntityID: uuidv4(),
        Type: data.type,
        Name: data.name,
        Description: data.description,
        Address: data.address,
        DirectoryPath: data.directory_path
    }, { transaction })

    if (!createdEntity) {
        throw new HttpError("Failed to create entity.", 500, "ENTITY_CREATION_FAILED")
    }

    return createdEntity.get({ plain: true }) as Entity
}

export default {
    create
}