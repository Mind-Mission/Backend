export type CreateCertificate = {
  studentId: number;
  courseId: number;
}

export type UpdateCertificate = {
  id: number;
  imgUrl: string;
  pdfUrl: string;
}