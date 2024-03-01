import { Admin, Instructor, Permission, Student, User } from "@prisma/client"

export interface ExtendedUser extends User {
  permissions?: Permission[];
  instructor?: Instructor;
  student?: Student;
  admin?: Admin
}