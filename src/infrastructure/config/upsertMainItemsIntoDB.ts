import bcrypt from "bcrypt"
import prisma from "../../domain/db"
import { AllowedModels, Permissions } from "../../presentation/types/ModelPermission";

export const upsertMainItemsIntoDB = async () => {
  const {Super_Admin_FirstName, Super_Admin_LastName, Super_Admin_Email, Super_Admin_Password} = process.env;

  const allowedModelsForInstructor = [
    {
      modelName: AllowedModels.Users,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Instructors,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Students,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Categories,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Courses,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Enrollments,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Sections,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Lessons,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Videos,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Articles,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Quizzes,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Ratings,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Comments,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
  ];

  const allowedModelsForStudent = [
    {
      modelName: AllowedModels.Users,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Students,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Instructors,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Categories,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Courses,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Sections,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Lessons,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Notes,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Comments,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Wishlists,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Carts,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Payments,
      permissions: [Permissions.Read, Permissions.Create]
    },
    {
      modelName: AllowedModels.Enrollments,
      permissions: [Permissions.Read, Permissions.Update]
    },
    {
      modelName: AllowedModels.Ratings,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
  ];

  const allowedModelsForSuperAdmin = [
    {
      modelName: AllowedModels.Roles,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Users,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Instructors,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Students,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Logs,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Categories,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Courses,
      permissions: [Permissions.Read, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Sections,
      permissions: [Permissions.Read, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Lessons,
      permissions: [Permissions.Read, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Notes,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Carts,
      permissions: [Permissions.Read]
    },
    {
      modelName: AllowedModels.Enrollments,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Ratings,
      permissions: [Permissions.Read, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Comments,
      permissions: [Permissions.Read, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Coupons,
      permissions: [Permissions.Read, Permissions.Create, Permissions.Update, Permissions.Delete]
    },
    {
      modelName: AllowedModels.Messages,
      permissions: [Permissions.Read, Permissions.Update, Permissions.Delete]
    },
  ];

  await Promise.all([
    prisma.role.upsert({
      where: {
        slug: 'super-admin',
      },
      update: {
        allowedModels: allowedModelsForSuperAdmin
      },
      create: {
        name: 'Super Admin',
        slug: 'super-admin',
        description: "This is highly privileged and authoritative user role within a system or organization's administrative hierarchy.",        
        allowedModels: allowedModelsForSuperAdmin,
        users: {
          create: {
            firstName: Super_Admin_FirstName || "Tarek",
            lastName: Super_Admin_LastName || "Eslam",
            email: Super_Admin_Email || "tarekeslam159@gmail.com",
            password: bcrypt.hashSync(Super_Admin_Password || "Ta123456789*", 10),
            admin: {
              create: {}
            }
          }
        }
      },
    }),
    prisma.role.upsert({
      where: {
        slug: 'instructor',
      },
      update: {
        allowedModels: allowedModelsForInstructor    
      },
      create: {
        name: 'Instructor',
        slug: 'instructor',
        allowedModels: allowedModelsForInstructor
      },
    }),   
    prisma.role.upsert({
      where: {
        slug: 'student',
      },
      update: {
        allowedModels: allowedModelsForStudent    
      },
      create: {
        name: 'Student',
        slug: 'student',
        allowedModels: allowedModelsForStudent
      },
    })
  ]);

  console.log("The main items are upsert into the database successfully ✅");
}