import { Prisma } from "@prisma/client";
import { ExtendedStudent } from "../../types/ExtendedStudent";
import { UpdateStudent } from "../../inputs/studentInput";
import { TransactionType } from "../../types/TransactionType";

export interface IStudentService {
  count(args: Prisma.StudentCountArgs): Promise<number>;
  findMany(args: Prisma.StudentFindManyArgs): Promise<ExtendedStudent[]>;
  findUnique(args: Prisma.StudentFindUniqueArgs): Promise<ExtendedStudent | null>
  findFirst(args: Prisma.StudentFindFirstArgs): Promise<ExtendedStudent | null>
  update(args: {data: UpdateStudent, select?: Prisma.StudentSelect, include?: Prisma.StudentInclude}, transaction?: TransactionType): Promise<ExtendedStudent>;
}