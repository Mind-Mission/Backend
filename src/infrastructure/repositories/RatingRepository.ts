import { Prisma, Rating } from "@prisma/client";
import { injectable } from "inversify";
import { IRatingRepository } from "../../application/interfaces/IRepositories/IRatingRepository";
import prisma from "../../domain/db";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { TransactionType } from "../../application/types/TransactionType";

@injectable()
export class RatingRepository implements IRatingRepository {
  constructor() {}

  aggregate(args: Prisma.RatingAggregateArgs): Promise<Prisma.GetRatingAggregateType<Prisma.RatingAggregateArgs>> {
    return prisma.rating.aggregate(args);
  }

  count(args: Prisma.RatingCountArgs): Promise<number> {
    return prisma.rating.count(args)
  }

  findMany(args: Prisma.RatingFindManyArgs): Promise<Rating[]> {
    return prisma.rating.findMany(args);
  }

  findUnique(args: Prisma.RatingFindUniqueArgs): Promise<Rating | null> {
    return prisma.rating.findUnique(args);
  }

  upsert(args: Prisma.RatingUpsertArgs, transaction?: TransactionType | undefined): Promise<Rating> {
    return (transaction || prisma).rating.upsert(args);
  }

  delete(id: number): Promise<Rating> {
    return prisma.rating.delete({
      where: {
        id
      }
    });
  }
}