import { Message } from "@prisma/client";
import { injectable } from "inversify";
import { IMessageRepository } from "../../application/interfaces/IRepositories/IMessageRepository";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class MessageRepository extends BaseRepository<Message> implements IMessageRepository {
  constructor() {
    super("Message");
  }
}