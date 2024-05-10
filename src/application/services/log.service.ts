import { Log, LogModel, OperationType, Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import { ILogRepository } from "../interfaces/IRepositories/i-log.repository";
import { ILogService } from "../interfaces/IServices/i-log.service"; 

@injectable()
export class LogService implements ILogService {
  constructor(@inject('ILogRepository') private logRepository: ILogRepository) {}
  count(args: Prisma.LogCountArgs): Promise<number> {
    return this.logRepository.count(args);
  };

  findMany(args: Prisma.LogFindManyArgs): Promise<Log[]> {
    return this.logRepository.findMany(args);
  };

  findUnique(args: Prisma.LogFindUniqueArgs): Promise<Log | null> {
    return this.logRepository.findUnique(args);
  };

  async log(operationType: OperationType, ModelName: LogModel, details: object, user: ExtendedUser | undefined): Promise<Log | undefined> {
    if(user?.roles.includes('Admin')) {
      const log = await this.logRepository.log({
        data: {
          operationType,
          ModelName,
          details,
          user: {
            connect: {
              id: user?.id,
            }
          }
        }
      });
      return log;
    };
  };
}