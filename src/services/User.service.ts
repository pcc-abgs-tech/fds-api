import { FindOptions, Op, Transaction, WhereOptions } from "sequelize"
import { model } from "../models";
import { HttpError } from "../utils/http-error";
import { hash } from "../helpers/password";
import moment from "moment-timezone";
import { Pagination } from "../interfaces/pagination.interface";

type UserCreationData = {
    username: string;
    password: string;
    entity_id: string | null;
    role_id: number;
    name: string;
}

interface UsersFilters {
    role_id?: number;
}

const generateUserID = async (role_id: number): Promise<string> => {
    const currentYear = new Date().getFullYear().toString().slice(-2)
    const timestamp = Date.now()

    return `${currentYear}${role_id}${timestamp}`
}

const get = async (user: string) => {
    const fetchedUser = model.user.findOne({
        attributes: [
            "UserID",
            "Username",
            "Name",
            "CreatedAt",
            "ModifiedAt",
            "LastLoginAt",
        ],
        include: [
            {
                model: model.role,
                as: "role",
                attributes: [
                    "RoleID",
                    "Description"
                ]
            }
        ],
        where: {
            [Op.or]: {
                UserID: user,
                Username: user
            }
        }
    })

    if (!fetchedUser) {
        throw new HttpError("User not found.", 404, "USER_NOT_FOUND")
    }

    return fetchedUser
}

const getAll = async (filters: UsersFilters, pagination: Pagination, search?: string) => {
    // const query: FindOptions = {
    //     include: [
    //         {
    //             model: model.role,
    //             as: "role",
    //             attributes: [
    //                 "RoleID",
    //                 "Description"
    //             ]
    //         },
    //         {
    //             model: model.entity,
    //             as: "entity",
    //             attributes: [
    //                 "EntityID",
    //                 "Name"
    //             ]
    //         }
    //     ]
    // }

    // if (filter.role_id !== undefined) {
    //     query.where = {
    //         RoleID: { [Op.ne]: filter.role_id }
    //     }
    // }

    // return await model.user.findAndCountAll(query)

    const page = pagination.page
    const limit = pagination.limit
    const offset = (page - 1) * limit

    // const where: WhereOptions = {}

    // // Filters
    // if (filters.role_id !== undefined) {
    //     where["RoleID"] = {
    //         [Op.ne]: filters.role_id
    //     }
    // }

    // Search
    if (search) {

    }

    const query: FindOptions = {
        // where,
        limit,
        offset,
        attributes: [
            "UserID",
            "Username",
            "Name",
            "CreatedAt",
            "ModifiedAt",
            "LastLoginAt"
        ],
        include: [
            {
                model: model.role,
                as: "role",
                attributes: [
                    "RoleID",
                    "Description"
                ]
            },
            {
                model: model.entity,
                as: "entity",
                attributes: [
                    "EntityID",
                    "Name",
                    "DirectoryPath"
                ]
            }
        ]
    }

    const fetchedUsers = await model.user.findAndCountAll(query)

    return {
        data: fetchedUsers.rows,
        pagination: {
            page: page,
            limit: limit,
            total: fetchedUsers.count,
            total_pages: Math.ceil(fetchedUsers.count / limit)
        }
    }
}

const create = async (data: UserCreationData, transaction?: Transaction) => {
    const hashedPassword = await hash(data.password)

    const createdUser = await model.user.create({
        UserID: await generateUserID(data.role_id),
        Username: data.username,
        Password: hashedPassword,
        EntityID: data.entity_id,
        RoleID: data.role_id,
        Name: data.name,
        CreatedAt: moment().tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss")
    })

    if (!createdUser) {
        throw new HttpError("Failed to create user.", 400, "USER_CREATION_FAILED")
    }

    return createdUser
}

export default {
    get,
    getAll,
    create
}