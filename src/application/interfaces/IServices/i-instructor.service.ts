import { Prisma } from "@prisma/client";
import { ExtendedInstructor } from "../extended/instructor.extend";
import { UpdateInstructor } from "../../inputs/instructor.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IInstructorService {
  count(args: Prisma.InstructorCountArgs): Promise<number>;
  findMany(args: Prisma.InstructorFindManyArgs): Promise<ExtendedInstructor[]>;
  findUnique(args: Prisma.InstructorFindUniqueArgs): Promise<ExtendedInstructor | null>
  update(args: {data: UpdateInstructor, select?: Prisma.InstructorSelect, include?: Prisma.InstructorInclude}, transaction?: TransactionType): Promise<ExtendedInstructor>;
  delete(args: {data: {userId: number, isDeleted: boolean}, select?: Prisma.InstructorSelect, include?: Prisma.InstructorInclude}, transaction?: TransactionType): Promise<ExtendedInstructor>;
}