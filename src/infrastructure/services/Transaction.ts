import prisma from "../../domain/db";
import { TransactionType } from "../../application/types/TransactionType";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

export abstract class Transaction {
  static async transact<T>(fn: (transaction: TransactionType) => Promise<T>, transaction?: TransactionType): Promise<T> {
		try {
			return transaction ? await fn(transaction) : await prisma.$transaction(async prismaTransaction => await fn(prismaTransaction));
		}catch(error: any) {
			if(error.code === 'P2028') { // P2028 status code for Transaction error
				return await Transaction.transact<T>(fn, transaction);
				// throw new APIError('Something went wrong, please try again!', HttpStatusCode.InternalServerError);
			}
			throw error;
		}
	};
}