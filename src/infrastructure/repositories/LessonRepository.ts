import { Prisma, Lesson } from "@prisma/client";
import { injectable } from "inversify";
import { ILessonRepository } from "../../application/interfaces/IRepositories/ILessonRepository";
import prisma from "../../domain/db";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class LessonRepository extends BaseRepository<Lesson> implements ILessonRepository {
  constructor() {
    super("Lesson");
  }

  findFirst(args: Prisma.LessonFindFirstArgs): Promise<Lesson | null> {
    return prisma.lesson.findFirst(args);
  }
}