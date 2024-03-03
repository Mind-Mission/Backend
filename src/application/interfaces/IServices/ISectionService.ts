import { Prisma, Section } from "@prisma/client";
import { CreateSection, UpdateSection } from "../../inputs/sectionInput";
import { TransactionType } from "../../types/TransactionType";
import { ExtendedUser } from "../../types/ExtendedUser";
import { IResourceOwnership } from "./IResourceOwnership";

export interface ISectionService extends IResourceOwnership<Section> {
  count(args: Prisma.SectionCountArgs): Promise<number>;
  findMany(args: Prisma.SectionFindManyArgs): Promise<Section[]>;
  findUnique(args: Prisma.SectionFindUniqueArgs): Promise<Section | null>
  findFirst(args: Prisma.SectionFindFirstArgs): Promise<Section | null>
  create(args: {data: CreateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction?: TransactionType): Promise<Section>;
  update(args: {data: UpdateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction?: TransactionType): Promise<Section>;
  delete(args: {id: number, user: ExtendedUser | undefined}, transaction?: TransactionType): Promise<Section>;
}