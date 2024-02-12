export type UpdateStudent = {
  userId: number;
  enrolledCourses?: number[];
  wishlistCourse?: {
    courseId: number, 
    operation: "connect" | "disconnect"
  };
}