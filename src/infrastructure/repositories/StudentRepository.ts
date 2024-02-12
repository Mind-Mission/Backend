import { Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { IStudentRepository } from "../../application/interfaces/IRepositories/IStudentRepository";
import prisma from "../../domain/db";
import { ExtendedStudent } from "../../application/types/ExtendedStudent";
import { TransactionType } from "../../application/types/TransactionType";

@injectable()
export class StudentRepository implements IStudentRepository {
  constructor() {}

  count(args: Prisma.StudentCountArgs): Promise<number> {
    return prisma.student.count(args)
  }

  findMany(args: Prisma.StudentFindManyArgs): Promise<ExtendedStudent[]> {
    return prisma.student.findMany(args);
  }

  findUnique(args: Prisma.StudentFindUniqueArgs): Promise<ExtendedStudent | null> {
    return prisma.student.findUnique(args);
  }

  findFirst(args: Prisma.StudentFindFirstArgs): Promise<ExtendedStudent | null> {
    return prisma.student.findFirst(args);
  }

  update(args: Prisma.StudentUpdateArgs, transaction?: TransactionType): Promise<ExtendedStudent> {
    return (transaction || prisma).student.update(args);
  }
}