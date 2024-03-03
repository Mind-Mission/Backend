import { Resource, Crud } from "@prisma/client";

export const InstructorPermissions = [
  {
    resource: Resource.Instructors,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Courses,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
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

export const SuperAdminPermissions = [
  // {
  //   resource: Resource.Permissions,
  //   cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  // },
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
    resource: Resource.Enrollments,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Coupons,
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
    resource: Resource.Ratings,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Comments,
    cruds: [Crud.Get, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Messages,
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
];