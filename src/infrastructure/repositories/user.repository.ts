import { Prisma } from "@prisma/client";
import { injectable } from "inversify";
import prisma from "../../domain/db"
import {IUserRepository} from "../../application/interfaces/IRepositories/i-user.repository"
import { ExtendedUser } from "../../application/types/ExtendedUser";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class UserRepository extends BaseRepository<ExtendedUser> implements IUserRepository {
	constructor() {
    super("User");
  }

  findFirst(args: Prisma.UserFindFirstArgs): Promise<ExtendedUser | null> {
    return prisma.user.findFirst(args);
  }
}