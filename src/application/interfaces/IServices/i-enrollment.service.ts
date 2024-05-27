import { Prisma } from "@prisma/client";
import { ExtendedEnrollment } from "../extended/enrollment.extend";
import { UpdateEnrollment } from "../../inputs/enrollment.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IEnrollmentService {
  count(args: Prisma.EnrollmentCountArgs): Promise<number>;
  findMany(args: Prisma.EnrollmentFindManyArgs): Promise<ExtendedEnrollment[]>;
  findUnique(args: Prisma.EnrollmentFindUniqueArgs): Promise<ExtendedEnrollment | null>;
  findFirst(args: Prisma.EnrollmentFindFirstArgs): Promise<ExtendedEnrollment | null>;
  update(args: {data: UpdateEnrollment, select?: Prisma.EnrollmentSelect, include?: Prisma.EnrollmentInclude}, transaction?: TransactionType): Promise<ExtendedEnrollment>;
  delete(id: number, transaction?: TransactionType): Promise<ExtendedEnrollment>;
}