import { NextFunction, Request, Response } from "express";
import { Sequelize, Transaction } from "sequelize";

type TryCatchHandler = (
    request: Request,
    response: Response,
    next: NextFunction,
    transaction: Transaction
) => Promise<any>

export const tryCatch = (sequelize: Sequelize) => {
    return (fn: TryCatchHandler) => {
        return async (request: Request, response: Response, next: NextFunction) => {
            const transaction = await sequelize.transaction()

            try {
                await fn(request, response, next, transaction)
                await transaction.commit()
            } catch (error) {
                await transaction.rollback()
                next(error)
            }
        }
    }
}