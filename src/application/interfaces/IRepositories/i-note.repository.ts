import { Prisma, Note } from "@prisma/client";
import { IFindBaseRepository } from "./Base/i-find-base.repository";
import { IDeleteBaseRepository } from "./Base/i-delete-base.repository";
import { TransactionType } from "../../types/TransactionType";

export interface INoteRepository extends IFindBaseRepository<Note>, IDeleteBaseRepository<Note> {
  upsert(args: Prisma.NoteUpsertArgs, transaction?: TransactionType): Promise<Note>;
}