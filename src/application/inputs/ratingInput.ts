export type UpsertRating = {
  userId: number;
  courseId: number;
  instructorRate?: number;
  courseRate?: number;
  commentForInstructor?: string;
  commentForCourse?: string;
}