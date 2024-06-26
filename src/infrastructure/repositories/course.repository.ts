import { Prisma, Course } from "@prisma/client";
import { injectable } from "inversify";
import { ICourseRepository } from "../../application/interfaces/IRepositories/i-course.repository";
import prisma from "../../domain/db";
import { BaseRepository } from "./Base/base.repository";

@injectable()
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository {
  constructor() {
    super("Course");
  }

  aggregate(args: Prisma.CourseAggregateArgs): Prisma.PrismaPromise<Prisma.GetCourseAggregateType<any>> {
    return prisma.course.aggregate(args);
  };

  findFirst(args: Prisma.CourseFindFirstArgs): Promise<Course | null> {
    return prisma.course.findFirst(args);
  }
}