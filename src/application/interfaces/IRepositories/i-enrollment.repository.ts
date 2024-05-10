import { Prisma } from "@prisma/client";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { IUpdateBaseRepository } from "./Base/i-update-base.repository";
import { IDeleteBaseRepository } from "./Base/i-delete-base.repository";
import { ExtendedEnrollment } from "../../types/ExtendedEnrollment";

export interface IEnrollmentRepository extends IFindBaseRepository<ExtendedEnrollment>, IUpdateBaseRepository<ExtendedEnrollment>, IDeleteBaseRepository<ExtendedEnrollment> {
  findFirst(args: Prisma.EnrollmentFindFirstArgs): Promise<ExtendedEnrollment | null>;
}