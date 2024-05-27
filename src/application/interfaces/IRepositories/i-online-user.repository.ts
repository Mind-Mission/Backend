
import { Prisma, OnlineUser } from "@prisma/client";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IOnlineUserRepository extends IFindBaseRepository<OnlineUser> {
  aggregate(args: Prisma.OnlineUserAggregateArgs): Prisma.PrismaPromise<Prisma.GetOnlineUserAggregateType<Prisma.OnlineUserAggregateArgs>>
  upsert(args: Prisma.OnlineUserUpsertArgs, transaction?: TransactionType): Promise<OnlineUser>
  delete(args: Prisma.OnlineUserDeleteArgs, transaction?: TransactionType): Promise<OnlineUser>;
}