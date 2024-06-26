import { Prisma, Course} from "@prisma/client";
import { IBaseRepository } from "./Base/i-base.repository";

export interface ICourseRepository extends IBaseRepository<Course> {
  aggregate(args: Prisma.CourseAggregateArgs): Prisma.PrismaPromise<Prisma.GetCourseAggregateType<any>>;
  findFirst(args: Prisma.CourseFindFirstArgs): Promise<Course | null>;
}