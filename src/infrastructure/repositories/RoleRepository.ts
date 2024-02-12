import { Role } from "@prisma/client";
import { injectable } from "inversify";
import {IRoleRepository} from "../../application/interfaces/IRepositories/IRoleRepository"
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class RoleRepository extends BaseRepository<Role> implements IRoleRepository {
  constructor() {
    super("Role");
  }
}