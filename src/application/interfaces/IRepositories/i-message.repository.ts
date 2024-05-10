import { Message } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface IMessageRepository extends IBaseRepository<Message> {
}