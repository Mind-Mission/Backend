import { Message } from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface IMessageRepository extends IBaseRepository<Message> {
}