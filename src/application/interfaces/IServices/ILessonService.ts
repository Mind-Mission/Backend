import { Prisma, Lesson } from "@prisma/client";
import { CreateLesson, UpdateLesson } from "../../inputs/lessonInput";
import { TransactionType } from "../../types/TransactionType";

export interface ILessonService {
  count(args: Prisma.LessonCountArgs): Promise<number>;
  findMany(args: Prisma.LessonFindManyArgs): Promise<Lesson[]>;
  findUnique(args: Prisma.LessonFindUniqueArgs): Promise<Lesson | null>
  create(args: {data: CreateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson>;
  update(args: {data: UpdateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson>;
  delete(id: number, transaction?: TransactionType): Promise<Lesson>;
}