import { HaveAudience, TeachingType, VideoProAcademy } from "@prisma/client";

export type UpdateInstructor = {
  id: number;
  bref?: string;
  specialization?: string;
  teachingType?: TeachingType;
  videoProAcademy?: VideoProAcademy;
  haveAudience?: HaveAudience;
  skills?: {name: string}[];
  isClosed?: boolean;
}