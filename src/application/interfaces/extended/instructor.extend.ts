import { Instructor, Skill, Course } from "@prisma/client";

export interface ExtendedInstructor extends Instructor {
  skills?: Skill[]
  courses?: Course[]
}