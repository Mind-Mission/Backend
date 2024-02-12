import { Prisma } from "@prisma/client";
import { ExtendedEnrollment } from "../../types/ExtendedEnrollment";
import { UpdateEnrollment } from "../../inputs/enrollmentInput";
import { TransactionType } from "../../types/TransactionType";

export interface IEnrollmentService {
  count(args: Prisma.EnrollmentCountArgs): Promise<number>;
  findMany(args: Prisma.EnrollmentFindManyArgs): Promise<ExtendedEnrollment[]>;
  findUnique(args: Prisma.EnrollmentFindUniqueArgs): Promise<ExtendedEnrollment | null>;
  findFirst(args: Prisma.EnrollmentFindFirstArgs): Promise<ExtendedEnrollment | null>;
  update(args: {data: UpdateEnrollment, select?: Prisma.EnrollmentSelect, include?: Prisma.EnrollmentInclude}, transaction?: TransactionType): Promise<ExtendedEnrollment>;
  delete(id: number, transaction?: TransactionType): Promise<ExtendedEnrollment>;
}