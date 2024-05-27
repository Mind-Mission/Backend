import { Cart, Course, Student } from "@prisma/client";

export interface ExtendedCart extends Cart {
  courses?: Course[]
  student?: Student[]
}