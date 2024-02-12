export type AllowedModel = "User" | "Role" | "Instructor" | "Student" | "Log" | "Category" | "Course" | "Payment" | "Enrollment" | "Wishlist" | "Cart" | "Rating" | "Section" | "Lesson" | "Video" | "Article" | "Quiz" | "Comment" | "Coupon" | "Message" | "Note" | "Certificate" | "CertificateTemplate";
export type AllowedMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const AllowedModels = {
  Users: 'user',
  Roles: 'role',
  Instructors: 'instructor',
  Students: 'student',
  Logs: "log",
  Categories: 'category',
  Courses: 'course',
  Wishlists: 'wishlist',
  Payments: 'payment',
  Enrollments: 'enrollment',
  Ratings: 'rating',
  Sections: 'section',
  Lessons: 'lesson',
  Notes: "note",
  Videos: 'video',
  Articles: 'article',
  Quizzes: 'quiz',
  Comments: 'comment',
  Coupons: 'coupon',
  Messages: 'message',
  Certificates: 'certificate',
  CertificateTemplates: 'certificateTemplate',
  Carts: 'cart',
}

export const Permissions = {
  Read: 'get',
  Create: 'post',
  Update: 'patch',
  Delete: 'delete'
}

Object.freeze(AllowedModels);
Object.freeze(Permissions);