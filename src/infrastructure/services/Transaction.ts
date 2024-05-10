import prisma from "../../domain/db";
import { TransactionType } from "../../application/interfaces/extended/transaction-type.extend";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";
import { PrismaCodeErrors } from "../enum/prisma-error.enum";

export abstract class Transaction {
  static async transact<T>(fn: (transaction: TransactionType) => Promise<T>, transaction?: TransactionType): Promise<T> {
		try {
			return transaction ? await fn(transaction) : await prisma.$transaction(async prismaTransaction => await fn(prismaTransaction));
		}catch(error: any) {
			if(error.code === PrismaCodeErrors.TRANSACTION_ERROR) {
				return await Transaction.transact<T>(fn, transaction);
				// throw new APIError('Something went wrong, please try again!', HttpStatusCode.InternalServerError);
			}
			throw error;
		}
	};
}