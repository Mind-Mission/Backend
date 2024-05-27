import { Prisma, Lesson } from "@prisma/client";
import { injectable } from "inversify";
import { ILessonRepository } from "../../application/interfaces/IRepositories/i-lesson.repository";
import prisma from "../../domain/db";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class LessonRepository extends BaseRepository<Lesson> implements ILessonRepository {
  constructor() {
    super("Lesson");
  }

  findFirst(args: Prisma.LessonFindFirstArgs): Promise<Lesson | null> {
    return prisma.lesson.findFirst(args);
  }
}