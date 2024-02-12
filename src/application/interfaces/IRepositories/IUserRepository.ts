import { Prisma } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";
import { ExtendedUser } from "../../types/ExtendedUser";

export interface IUserRepository extends IBaseRepository<ExtendedUser> {
  findFirst(args: Prisma.UserFindFirstArgs): Promise<ExtendedUser | null>;
}