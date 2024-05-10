import { Course, Enrollment, Lesson } from "@prisma/client";

export interface ExtendedEnrollment extends Enrollment {
  course?: Course;
  completedLessons?: Lesson[];
}