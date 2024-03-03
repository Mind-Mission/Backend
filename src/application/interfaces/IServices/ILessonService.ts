import { Prisma, Lesson } from "@prisma/client";
import { CreateLesson, UpdateLesson } from "../../inputs/lessonInput";
import { TransactionType } from "../../types/TransactionType";
import { IResourceOwnership } from "./IResourceOwnership";
import { ExtendedUser } from "../../types/ExtendedUser";

export interface ILessonService extends IResourceOwnership<Lesson> {
  count(args: Prisma.LessonCountArgs): Promise<number>;
  findMany(args: Prisma.LessonFindManyArgs): Promise<Lesson[]>;
  findUnique(args: Prisma.LessonFindUniqueArgs): Promise<Lesson | null>;
  findFirst(args: Prisma.LessonFindFirstArgs): Promise<Lesson | null>;
  create(args: {data: CreateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson>;
  update(args: {data: UpdateLesson, select?: Prisma.LessonSelect, include?: Prisma.LessonInclude}, transaction?: TransactionType): Promise<Lesson>;
  delete(args: {id: number, user: ExtendedUser | undefined}, transaction?: TransactionType): Promise<Lesson>;
}