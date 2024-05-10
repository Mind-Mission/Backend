import { Prisma, Lesson } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ILessonRepository extends IBaseRepository<Lesson> {
  findFirst(args: Prisma.LessonFindFirstArgs): Promise<Lesson | null>
}