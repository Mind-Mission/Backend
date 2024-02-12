import { Role } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface IRoleRepository extends IBaseRepository<Role> {
}