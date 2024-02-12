export type UpdateInstructor = {
  id: number;
  bref?: string;
  specialization?: string;
  skills?: {name: string}[];
}