import { Prisma, Lesson } from "@prisma/client";
import { CreateLesson, UpdateLesson } from "../../inputs/lesson.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface ILessonService {
  count(args: Prisma.LessonCountArgs): Promise<number>;
  findMany(args: Prisma.LessonFindManyArgs): Promise<Lesson[]>;
  findUnique(args: Prisma.LessonFindUniqueArgs): Promise<Lesson | null>;
  findFirst(args: Prisma.LessonFindFirstArgs): Promise<Lesson | null>;
  create(args: {data: CreateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson>;
  update(args: {data: UpdateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson>;
  delete(id: number, transaction?: TransactionType): Promise<Lesson>;
}