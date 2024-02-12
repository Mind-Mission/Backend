import { Quiz } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface IQuizRepository extends IBaseRepository<Quiz> {
}