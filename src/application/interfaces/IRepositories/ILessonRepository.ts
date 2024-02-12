import { Prisma, Lesson } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ILessonRepository extends IBaseRepository<Lesson> {
  findFirst(args: Prisma.LessonFindFirstArgs): Promise<Lesson | null>
}