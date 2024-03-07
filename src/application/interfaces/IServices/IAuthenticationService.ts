import { Prisma } from "@prisma/client";
import { Signup, Login } from "../../inputs/authenticationInput";

export interface IAuthenticationService {
  signup(args: {data: Signup, select?: Prisma.UserSelect, include?: Prisma.UserInclude}): Promise<{user: any, token: string}>;
  login(args: {data: Login, select?: Prisma.UserSelect, include?: Prisma.UserInclude}): Promise<{user: any, token: string}>;
  forgetPassword(email: string): Promise<void>;
  verifyResetPasswordCode(email: string, code: string): Promise<void>;
  resetPassword(email: string, newPassword: string): Promise<void>;
  refreshToken(accessToken: string, refreshToken: string): Promise<{accessToken: string, refreshToken: string}>;
}