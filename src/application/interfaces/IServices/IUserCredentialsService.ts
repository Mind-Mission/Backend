import { Prisma } from "@prisma/client";
import { ExtendedUser } from "../../types/ExtendedUser";

export interface IUserCredentialsService {
  updateEmail(args: {data: {id: number, oldEmail: string; newEmail: string; password: string}, select?: Prisma.UserSelect, include: Prisma.UserInclude}): Promise<ExtendedUser>;
  generateEmailVerificationCode(id: number): Promise<void>;
  confirmEmailVerificationCode(id: number, token: string): Promise<void>
  updatePassword(args: {data: {id: number, email: string, oldPassword: string, newPassword: string}, select?: Prisma.UserSelect, include?: Prisma.UserInclude}): Promise<ExtendedUser>;
}