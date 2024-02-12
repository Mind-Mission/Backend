import { Prisma, Rating } from "@prisma/client";
import { IFindBaseRepository } from "./Base/IFindBaseRepository";
import { IDeleteBaseRepository } from "./Base/IDeleteBaseRepository";
import { TransactionType } from "../../types/TransactionType";

export interface IRatingRepository extends IFindBaseRepository<Rating>, IDeleteBaseRepository<Rating> {
  aggregate(args: Prisma.RatingAggregateArgs): Promise<Prisma.GetRatingAggregateType<Prisma.RatingAggregateArgs>>
  upsert(args: Prisma.RatingUpsertArgs, transaction?: TransactionType): Promise<Rating>
}