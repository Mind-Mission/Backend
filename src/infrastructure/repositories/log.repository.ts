import { injectable } from "inversify";
import { Prisma, Log } from "@prisma/client";
import {ILogRepository} from "../../application/interfaces/IRepositories/ILogRepository"
import prisma from "../../domain/db";

@injectable()
export class LogRepository implements ILogRepository {
  constructor() {}
  
  count(args: Prisma.LogCountArgs): Promise<number> {
    return prisma.log.count(args);
  }
  
  findMany(args: Prisma.LogFindManyArgs): Promise<Log[]> {
    return prisma.log.findMany(args);
  }

  findUnique(args: Prisma.LogFindUniqueArgs): Promise<Log | null> {
    return prisma.log.findUnique(args);
  }

  log(args: Prisma.LogCreateArgs): Promise<Log> {
    return prisma.log.create(args);
  }
}