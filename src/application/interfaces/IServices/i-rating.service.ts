import { Prisma, Rating } from "@prisma/client";
import { TransactionType } from "../extended/transaction-type.extend";
import { UpsertRating } from "../../inputs/rating.input";

export interface IRatingService {
  aggregate(args: Prisma.RatingAggregateArgs): Promise<Prisma.GetRatingAggregateType<Prisma.RatingAggregateArgs>>
  count(args: Prisma.RatingCountArgs): Promise<number>;
  findMany(args: Prisma.RatingFindManyArgs): Promise<Rating[]>;
  findUnique(args: Prisma.RatingFindUniqueArgs): Promise<Rating | null>
  upsert(args: {data: UpsertRating, select?: Prisma.RatingSelect, include?: Prisma.RatingInclude}, transaction?: TransactionType): Promise<Rating>;
  delete(id: number, transaction?: TransactionType): Promise<Rating>;
}