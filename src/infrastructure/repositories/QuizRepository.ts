import { Quiz } from "@prisma/client";
import { injectable } from "inversify";
import { IQuizRepository } from "../../application/interfaces/IRepositories/IQuizRepository";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class QuizRepository extends BaseRepository<Quiz> implements IQuizRepository {
  constructor() {
    super("Quiz");
  }
}