export type UpdateCart = {
  userId: number;
  courseId: number;
  operation: 'Add' | 'Remove'
}