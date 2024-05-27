import { Resource, Crud } from "@prisma/client";

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