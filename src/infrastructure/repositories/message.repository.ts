import { Message } from "@prisma/client";
import { injectable } from "inversify";
import { IMessageRepository } from "../../application/interfaces/IRepositories/i-message.repository";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class MessageRepository extends BaseRepository<Message> implements IMessageRepository {
  constructor() {
    super("Message");
  }
}