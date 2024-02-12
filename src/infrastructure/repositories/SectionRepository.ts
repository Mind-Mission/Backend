import { Prisma, Section } from "@prisma/client";
import { injectable } from "inversify";
import { ISectionRepository } from "../../application/interfaces/IRepositories/ISectionRepository";
import prisma from "../../domain/db";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class SectionRepository extends BaseRepository<Section> implements ISectionRepository {
  constructor() {
    super("Section");
  }

  findFirst(args: Prisma.SectionFindFirstArgs): Promise<Section | null> {
    return prisma.section.findFirst(args);
  };
}