import { Log, OperationType, LogModel, Prisma } from "@prisma/client";
import { ExtendedUser } from "../extended/user.extend";

export interface ILogService {
  count(args: Prisma.LogCountArgs): Promise<number>;
  findMany(args: Prisma.LogFindManyArgs): Promise<Log[]>;
  findUnique(args: Prisma.LogFindUniqueArgs): Promise<Log | null>;
  log(operationType: OperationType, modelName: LogModel, details: object, user: ExtendedUser | undefined): Promise<Log | undefined>;
}