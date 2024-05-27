import { ExtendedStudent } from "../extended/student.extend";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { IUpdateBaseRepository } from "./Base/i-update-base.repository";
import { Prisma } from "@prisma/client";

export interface IStudentRepository extends IFindBaseRepository<ExtendedStudent>, IUpdateBaseRepository<ExtendedStudent> {
  findFirst(args: Prisma.StudentFindFirstArgs): Promise<ExtendedStudent | null>;
}