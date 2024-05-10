import { Prisma } from "@prisma/client";
import { injectable } from "inversify";
import { ExtendedEnrollment } from "../../application/types/ExtendedEnrollment";
import { IEnrollmentRepository } from "../../application/interfaces/IRepositories/IEnrollmentRepository";
import prisma from "../../domain/db";
import { TransactionType } from "../../application/types/TransactionType";

@injectable()
export class EnrollmentRepository implements IEnrollmentRepository {

  count(args: Prisma.EnrollmentCountArgs): Promise<number> {
    return prisma.enrollment.count(args);
  };

  findMany(args: Prisma.EnrollmentFindManyArgs): Promise<ExtendedEnrollment[]> {
    return prisma.enrollment.findMany(args);
  };

  findUnique(args: Prisma.EnrollmentFindUniqueArgs): Promise<ExtendedEnrollment | null> {
    return prisma.enrollment.findUnique(args);
  };

  findFirst(args: Prisma.EnrollmentFindFirstArgs): Promise<ExtendedEnrollment | null> {
    return prisma.enrollment.findFirst(args);
  };

  update(args: Prisma.EnrollmentUpdateArgs, transaction?: TransactionType): Promise<ExtendedEnrollment> {
    return (transaction || prisma).enrollment.update(args);
  };

  delete(id: number, transaction?: TransactionType): Promise<ExtendedEnrollment> {
    return (transaction || prisma).enrollment.delete({
      where: {
        id
      }
    });
  };
}