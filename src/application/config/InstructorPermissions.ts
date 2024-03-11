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
    resource: Resource.Coupons,
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
