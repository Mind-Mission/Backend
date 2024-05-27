import { Prisma, Section } from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ISectionRepository extends IBaseRepository<Section> {
  findFirst(args: Prisma.SectionFindFirstArgs): Promise<Section | null>;
}