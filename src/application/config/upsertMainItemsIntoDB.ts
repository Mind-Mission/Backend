import { Resource, Crud } from "@prisma/client";
import bcrypt from "bcrypt"
import prisma from "../../domain/db"

export const InstructorPermissions = [
  {
    resource: Resource.Users,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Instructors,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Students,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Categories,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Courses,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Enrollments,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Sections,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Lessons,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Videos,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Articles,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Quizzes,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Ratings,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Comments,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
];

export const StudentPermissions = [
  {
    resource: Resource.Users,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Students,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Instructors,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Categories,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Courses,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Sections,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Lessons,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Notes,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Comments,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Wishlists,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Carts,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Payments,
    cruds: [Crud.Get, Crud.Add]
  },
  {
    resource: Resource.Enrollments,
    cruds: [Crud.Get, Crud.Update]
  },
  {
    resource: Resource.Ratings,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
];

const AdminPermissions = [
  {
    resource: Resource.Permissions,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Users,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Instructors,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Students,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Logs,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Categories,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Courses,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Sections,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Lessons,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Notes,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Carts,
    cruds: [Crud.Get]
  },
  {
    resource: Resource.Enrollments,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Ratings,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Comments,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Coupons,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Messages,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
];

export const upsertMainItemsIntoDB = async () => {
  const {Super_Admin_FirstName, Super_Admin_LastName, Super_Admin_Email, Super_Admin_Password} = process.env;
  await prisma.user.upsert({
    where: {
      email: Super_Admin_Email,
    },
    update: {
      permissions: {
        deleteMany: {},
        createMany: {
          data: AdminPermissions
        }
      }
    },
    create: {
      firstName: Super_Admin_FirstName || "Tarek",
      lastName: Super_Admin_LastName || "Eslam",
      email: Super_Admin_Email || "tarekeslam159@gmail.com",
      password: bcrypt.hashSync(Super_Admin_Password || "123456789", 10),
      role: 'Admin',
      admin: {
        create: {}
      },
      permissions: {
        createMany: {
          data: AdminPermissions
        }
      } 
    },
  });
  console.log("The main items are upsert into the database successfully ✅");
}