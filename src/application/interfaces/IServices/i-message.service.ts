import { Prisma, Message } from "@prisma/client";
import { CreateMessage, UpdateMessage } from "../../inputs/message.input";
import { TransactionType } from "../extended/transaction-type.extend";

export interface IMessageService {
  count(args: Prisma.MessageCountArgs): Promise<number>;
  findMany(args: Prisma.MessageFindManyArgs): Promise<Message[]>;
  findUnique(args: Prisma.MessageFindUniqueArgs): Promise<Message | null>
  create(args: {data: CreateMessage, select?: Prisma.MessageSelect, include?: Prisma.MessageInclude}, transaction?: TransactionType): Promise<Message>;
  update(args: {data: UpdateMessage, select?: Prisma.MessageSelect, include?: Prisma.MessageInclude}, transaction?: TransactionType): Promise<Message>;
  delete(id: number, transaction?: TransactionType): Promise<Message>;
}