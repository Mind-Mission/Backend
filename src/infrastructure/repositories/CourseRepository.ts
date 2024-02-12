import { Prisma, Course } from "@prisma/client";
import { injectable } from "inversify";
import { ICourseRepository } from "../../application/interfaces/IRepositories/ICourseRepository";
import prisma from "../../domain/db";
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository {
  constructor() {
    super("Course");
  }

  aggregate(args: Prisma.CourseAggregateArgs): Prisma.PrismaPromise<Prisma.GetCourseAggregateType<any>> {
    return prisma.course.aggregate(args);
  };
}