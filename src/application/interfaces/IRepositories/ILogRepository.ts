import { Log, Prisma } from "@prisma/client";

export interface ILogRepository {
  count(args: Prisma.LogCountArgs): Promise<number>;
  findMany(args: Prisma.LogFindManyArgs): Promise<Log[]>;
  findUnique(args: Prisma.LogFindUniqueArgs): Promise<Log | null>;
  log(args: Prisma.LogCreateArgs): Promise<Log>
}