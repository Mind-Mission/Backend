import { Admin, Instructor, Student, User } from "@prisma/client"
import { ExtendedRole } from "./ExtendedRole";

export interface ExtendedUser extends User {
  role?: ExtendedRole;
  instructor?: Instructor;
  student?: Student;
  admin?: Admin
}