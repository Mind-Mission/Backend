import { Prisma, Message } from "@prisma/client"
import {inject, injectable } from "inversify"
import { IMessageService } from "../interfaces/IServices/i-message.service"
import { IMessageRepository } from "../interfaces/IRepositories/i-message.repository"
import { CreateMessage, UpdateMessage } from "../inputs/message.input"
import { TransactionType } from "../interfaces/extended/transaction-type.extend"

@injectable()
export class MessageService implements IMessageService {
	constructor(@inject('IMessageRepository') private messageRepository: IMessageRepository) {}

	count(args: Prisma.MessageCountArgs): Promise<number> {
		return this.messageRepository.count(args);
	};

	findMany(args: Prisma.MessageFindManyArgs): Promise<Message[]> {
		return this.messageRepository.findMany(args);
	};

	findUnique(args: Prisma.MessageFindUniqueArgs): Promise<Message | null> {
		return this.messageRepository.findUnique(args);
	};

  create(args: {data: CreateMessage, select?: Prisma.MessageSelect, include?: Prisma.MessageInclude}, transaction?: TransactionType): Promise<Message> {
		const {name, email, message} = args.data;		
		return this.messageRepository.create({
			data: {
        name,
        email,
        message
			},
			select: args.select,
			include: args.include
    }, transaction);
	};

	update(args: {data: UpdateMessage, select?: Prisma.MessageSelect, include?: Prisma.MessageInclude}, transaction?: TransactionType): Promise<Message> {
		const {id, subject, reply, replierId} = args.data;
		return this.messageRepository.update({
			where: {
				id
			},
			data: {
				subject,
				reply: reply,
				isReplied: true,
        replier: {
          connect: {
            id: replierId
          }
        }
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	delete(id: number, transaction?: TransactionType): Promise<Message> {
		return this.messageRepository.delete(id, transaction);
	};
}