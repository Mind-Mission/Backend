export type UpsertRating = {
  studentId: number;
  courseId: number;
  instructorRate?: number;
  courseRate?: number;
  commentForInstructor?: string;
  commentForCourse?: string;
}