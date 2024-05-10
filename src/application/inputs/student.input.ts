export type UpdateStudent = {
  id: number;
  enrolledCourses?: number[];
  wishlistCourse?: {
    courseId: number, 
    operation: "connect" | "disconnect"
  };
}