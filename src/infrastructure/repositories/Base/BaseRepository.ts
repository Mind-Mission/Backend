import { Prisma } from "@prisma/client";
import { injectable, unmanaged } from "inversify";
import { IBaseRepository } from "../../../application/interfaces/IRepositories/Base/IBaseRepository";
import prisma from "../../../domain/db";
import { TransactionType } from "../../../application/types/TransactionType";

@injectable()
export class BaseRepository<T> implements IBaseRepository<T> {
  protected prismaModel!: any;
  constructor(@unmanaged() private modelName: Prisma.ModelName) {
    this.modelName = this.modelName.toLowerCase()[0] + this.modelName.slice(1) as any
    this.prismaModel = prisma[this.modelName as any]
  }

  count(args: any): Promise<number> {
    return this.prismaModel.count(args)
  }

  findMany(args: any): Promise<T[]> {
    return this.prismaModel.findMany(args);
  }

  findUnique(args: any): Promise<T | null> {
    return this.prismaModel.findUnique(args);
  }

  create(args: any, transaction?: TransactionType): Promise<T> {
    const prismaModel = transaction ? transaction[this.modelName as any] : this.prismaModel;
    return prismaModel.create(args);
  }

  update(args: any, transaction?: TransactionType): Promise<T> {
    const prismaModel = transaction ? transaction[this.modelName as any] : this.prismaModel;
    return prismaModel.update(args);
  }

  delete(id: number, transaction?: TransactionType): Promise<T> {
    const prismaModel = transaction ? transaction[this.modelName as any] : this.prismaModel;
    return prismaModel.delete({
      where: {
        id,
      }
    });
  }
}