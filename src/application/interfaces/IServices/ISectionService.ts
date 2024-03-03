import { Prisma, Section } from "@prisma/client";
import { CreateSection, UpdateSection } from "../../inputs/sectionInput";
import { TransactionType } from "../../types/TransactionType";

export interface ISectionService {
  count(args: Prisma.SectionCountArgs): Promise<number>;
  findMany(args: Prisma.SectionFindManyArgs): Promise<Section[]>;
  findUnique(args: Prisma.SectionFindUniqueArgs): Promise<Section | null>
  findFirst(args: Prisma.SectionFindFirstArgs): Promise<Section | null>
  create(args: {data: CreateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction?: TransactionType): Promise<Section>;
  update(args: {data: UpdateSection, select?: Prisma.SectionSelect, include?: Prisma.SectionInclude}, transaction?: TransactionType): Promise<Section>;
  delete(id: number, transaction?: TransactionType): Promise<Section>;
}