import { Prisma, Quiz } from "@prisma/client";
import { CreateQuiz, UpdateQuiz } from "../../inputs/quizInput";
import { TransactionType } from "../../types/TransactionType";
import { ExtendedUser } from "../../types/ExtendedUser";
import { IResourceOwnership } from "./IResourceOwnership";

export interface IQuizService extends IResourceOwnership<Quiz> {
  count(args: Prisma.QuizCountArgs): Promise<number>;
  findMany(args: Prisma.QuizFindManyArgs): Promise<Quiz[]>;
  findUnique(args: Prisma.QuizFindUniqueArgs): Promise<Quiz | null>
  create(args: {data: CreateQuiz, select?: Prisma.QuizSelect, include?: Prisma.QuizInclude}, transaction?: TransactionType): Promise<Quiz>;
  update(args: {data: UpdateQuiz, select?: Prisma.QuizSelect, include?: Prisma.QuizInclude}, transaction?: TransactionType): Promise<Quiz>;
  delete(args: {id: number, user: ExtendedUser}, transaction?: TransactionType): Promise<Quiz>;
}