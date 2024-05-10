import { Prisma } from "@prisma/client";
import { ExtendedStudent } from "../extended/student.extend";
import { UpdateStudent } from "../../inputs/student.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IStudentService {
  count(args: Prisma.StudentCountArgs): Promise<number>;
  findMany(args: Prisma.StudentFindManyArgs): Promise<ExtendedStudent[]>;
  findUnique(args: Prisma.StudentFindUniqueArgs): Promise<ExtendedStudent | null>
  findFirst(args: Prisma.StudentFindFirstArgs): Promise<ExtendedStudent | null>
  update(args: {data: UpdateStudent, select?: Prisma.StudentSelect, include?: Prisma.StudentInclude}, transaction?: TransactionType): Promise<ExtendedStudent>;
}