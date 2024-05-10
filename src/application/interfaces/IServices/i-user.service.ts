import { Prisma } from "@prisma/client";
import { ExtendedUser } from "../extended/user.extend";
import { CreateUser, UpdateUser } from "../../inputs/user.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IUserService {
  count(args: Prisma.UserCountArgs): Promise<number>;
  findMany(args: Prisma.UserFindManyArgs): Promise<ExtendedUser[]>;
  findUnique(args: Prisma.UserFindUniqueArgs): Promise<ExtendedUser | null>
  findFirst(args: Prisma.UserFindFirstArgs): Promise<ExtendedUser | null> 
  create(args: {data: CreateUser, select?: Prisma.UserSelect, include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser>;
  update(args: {data: UpdateUser, select?: Prisma.UserSelect, include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser>;
  delete(args: {data: {id: number, isDeleted: boolean}, select?: Prisma.UserSelect, include?: Prisma.UserInclude}, transaction?: TransactionType): Promise<ExtendedUser>;
}