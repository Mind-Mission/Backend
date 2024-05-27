import { Student, Course, Enrollment } from "@prisma/client";

export interface ExtendedStudent extends Student {
  enrollmentCourses?: Enrollment[]
  wishlistCourses?: Course[]
}