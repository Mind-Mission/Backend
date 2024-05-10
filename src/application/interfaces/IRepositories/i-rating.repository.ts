import { Prisma, Rating } from "@prisma/client";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { IDeleteBaseRepository } from "./Base/i-delete-base.repository";
import { TransactionType } from "../../types/TransactionType";

export interface IRatingRepository extends IFindBaseRepository<Rating>, IDeleteBaseRepository<Rating> {
  aggregate(args: Prisma.RatingAggregateArgs): Promise<Prisma.GetRatingAggregateType<Prisma.RatingAggregateArgs>>
  upsert(args: Prisma.RatingUpsertArgs, transaction?: TransactionType): Promise<Rating>
}