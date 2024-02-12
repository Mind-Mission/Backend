import { Prisma, Note } from "@prisma/client";
import { IFindBaseRepository } from "./Base/IFindBaseRepository";
import { IDeleteBaseRepository } from "./Base/IDeleteBaseRepository";
import { TransactionType } from "../../types/TransactionType";

export interface INoteRepository extends IFindBaseRepository<Note>, IDeleteBaseRepository<Note> {
  upsert(args: Prisma.NoteUpsertArgs, transaction?: TransactionType): Promise<Note>;
}