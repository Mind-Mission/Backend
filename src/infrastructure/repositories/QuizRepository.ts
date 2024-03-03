import { Prisma, Quiz } from "@prisma/client";
import { injectable } from "inversify";
import { IQuizRepository } from "../../application/interfaces/IRepositories/IQuizRepository";
import { BaseRepository } from "./Base/BaseRepository";
import prisma from "../../domain/db";

@injectable()
export class QuizRepository extends BaseRepository<Quiz> implements IQuizRepository {
  constructor() {
    super("Quiz");
  }

  findFirst(args: Prisma.QuizFindFirstArgs): Promise<Quiz | null> {
    return prisma.quiz.findFirst(args);
  };
}