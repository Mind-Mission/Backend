import { Prisma } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";
import { ExtendedUser } from "../extended/user.extend";

export interface IUserRepository extends IBaseRepository<ExtendedUser> {
  findFirst(args: Prisma.UserFindFirstArgs): Promise<ExtendedUser | null>;
}