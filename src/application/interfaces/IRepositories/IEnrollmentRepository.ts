import { Prisma } from "@prisma/client";
import { IFindBaseRepository } from "./Base/IFindBaseRepository";
import { IUpdateBaseRepository } from "./Base/IUpdateBaseRepository";
import { IDeleteBaseRepository } from "./Base/IDeleteBaseRepository";
import { ExtendedEnrollment } from "../../types/ExtendedEnrollment";

export interface IEnrollmentRepository extends IFindBaseRepository<ExtendedEnrollment>, IUpdateBaseRepository<ExtendedEnrollment>, IDeleteBaseRepository<ExtendedEnrollment> {
  findFirst(args: Prisma.EnrollmentFindFirstArgs): Promise<ExtendedEnrollment | null>;
}