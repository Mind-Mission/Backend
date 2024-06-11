import { Resource, Crud } from "@prisma/client";

export const SuperAdminPermissions = [
  // {
  //   resource: Resource.Permissions,
  //   cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  // },
  {
    resource: Resource.Admins,
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
    cruds: [Crud.Get, Crud.Delete]
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
    resource: Resource.Offers,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Settings,
    cruds: [Crud.Get, Crud.Add, Crud.Update, Crud.Delete]
  },
  {
    resource: Resource.Payments,
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