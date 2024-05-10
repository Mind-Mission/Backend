import { Note, Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { INoteRepository } from "../../application/interfaces/IRepositories/INoteRepository";
import { TransactionType } from "../../application/types/TransactionType";
import prisma from "../../domain/db";

@injectable()
export class NoteRepository implements INoteRepository {
  constructor() {}

  count(args: Prisma.NoteCountArgs): Promise<number> {
    return prisma.note.count(args);
  };
  
  findMany(args: Prisma.NoteFindManyArgs): Promise<Note[]> {
    return prisma.note.findMany(args);
  };
  
  findUnique(args: Prisma.NoteFindUniqueArgs): Promise<Note | null> {
    return prisma.note.findUnique(args);
  };

  upsert(args: Prisma.NoteUpsertArgs, transaction: TransactionType): Promise<Note> {
    return (transaction || prisma).note.upsert(args);
  };
  
  delete(id: number, transaction?: TransactionType | undefined): Promise<Note> {
    return (transaction || prisma).note.delete({
      where: {
        id
      }
    });
  };
}