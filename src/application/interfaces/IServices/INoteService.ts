import { Prisma, Note } from "@prisma/client";
import { UpsertNote } from "../../inputs/noteInput";
import { TransactionType } from "../../types/TransactionType";

export interface INoteService {
  count(args: Prisma.NoteCountArgs): Promise<number>;
  findMany(args: Prisma.NoteFindManyArgs): Promise<Note[]>;
  findUnique(args: Prisma.NoteFindUniqueArgs): Promise<Note | null>
  upsert(args: {data: UpsertNote, select?: Prisma.NoteSelect, include?: Prisma.NoteInclude}, transaction?: TransactionType): Promise<Note>;
  delete(id: number, transaction?: TransactionType): Promise<Note>;
}