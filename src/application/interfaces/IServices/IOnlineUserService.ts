import { Prisma, OnlineUser } from "@prisma/client";
import { CreateOnlineUser } from "../../inputs/onlineUserInput";
import { TransactionType } from "../../types/TransactionType";

export interface IOnlineUserService {
  aggregate(args: Prisma.OnlineUserAggregateArgs): Prisma.PrismaPromise<Prisma.GetOnlineUserAggregateType<Prisma.OnlineUserAggregateArgs>>
  count(args: Prisma.OnlineUserCountArgs): Promise<number>;
  findMany(args: Prisma.OnlineUserFindManyArgs): Promise<OnlineUser[]>;
  findUnique(args: Prisma.OnlineUserFindUniqueArgs): Promise<OnlineUser | null>
  create(args: {data: CreateOnlineUser, select?: Prisma.OnlineUserSelect, include?: Prisma.OnlineUserInclude}, transaction?: TransactionType): Promise<OnlineUser>;
  delete(socketId: string, transaction?: TransactionType): Promise<OnlineUser>;
}