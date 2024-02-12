import { Prisma, Role } from "@prisma/client";
import { CreateRole, UpdateRole } from "../../inputs/roleInput";
import { TransactionType } from "../../types/TransactionType";

export interface IRoleService {
  count(args: Prisma.RoleCountArgs): Promise<number>;
  findMany(args: Prisma.RoleFindManyArgs): Promise<Role[]>;
  findUnique(args: Prisma.RoleFindUniqueArgs): Promise<Role | null>
  create(args: {data: CreateRole, select?: Prisma.RoleSelect, include?: Prisma.RoleInclude}, transaction?: TransactionType): Promise<Role>;
  update(args: {data: UpdateRole, select?: Prisma.RoleSelect, include?: Prisma.RoleInclude}, transaction?: TransactionType): Promise<Role>;
  delete(id: number, transaction?: TransactionType): Promise<Role>;
}