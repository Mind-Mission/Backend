import { Course, Prisma} from "@prisma/client";
import { IBaseRepository } from "./Base/IBaseRepository";

export interface ICourseRepository extends IBaseRepository<Course> {
  aggregate(args: Prisma.CourseAggregateArgs): Prisma.PrismaPromise<Prisma.GetCourseAggregateType<any>>
}