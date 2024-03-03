import { Prisma, Quiz } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface IQuizRepository extends IBaseRepository<Quiz> {
  findFirst(args: Prisma.QuizFindFirstArgs): Promise<Quiz | null>;
}