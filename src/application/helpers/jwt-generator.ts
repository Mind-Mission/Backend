import JWT, { JwtPayload } from "jsonwebtoken";
import { ExtendedUser } from "../interfaces/extended/user.extend";
import APIError from "../../presentation/errorHandlers/APIError";
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode";

export abstract class JWTGenerator {
  private static accessTokenSecretKey: string = process.env.JWT_Access_Token_Secret_Key as string;
  private static refreshTokenSecretKey: string = process.env.JWT_Refresh_Token_Secret_Key as string;
  private static emailVerificationTokenSecretKey: string = process.env.JWT_Email_Verification_Token_Secret_Key as string;
  private static forgetPasswordTokenSecretKey: string = process.env.JWT_Forget_Password_Token_Secret_Key as string;

  static generateAccessToken(user: any) {
    const {id, email, isActive, isBlocked, isDeleted, isEmailVerified, roles, permissions} = user;
    const payload = {
      id,
      email,
      isActive,
      isBlocked,
      isDeleted,
      isEmailVerified,
      roles,
      permissions,
      student: user.student,
      instructor: user.instructor
    };
    return JWT.sign(payload, this.accessTokenSecretKey, {expiresIn: "20min"});
  };

  static generateRefreshToken(user: ExtendedUser) {
    const {id, firstName, lastName, email, picture} = user;
    return JWT.sign({id, firstName, lastName, email, picture}, this.refreshTokenSecretKey, {expiresIn: "30d"});
  };

  static generateForgetPasswordToken(user: ExtendedUser) {
    const {id, firstName, lastName, email} = user;
    return JWT.sign({id, firstName, lastName, email}, this.forgetPasswordTokenSecretKey, {expiresIn: "2min"});
  };

  static generateEmailVerificationToken(user: ExtendedUser) {
    const {firstName, lastName, email, picture} = user;
    return JWT.sign({firstName, lastName, email, picture}, this.emailVerificationTokenSecretKey, {expiresIn: "10min"});
  };
  
  static verifyAccessToken(token: string): string | JWT.JwtPayload | any {
    return JWT.verify(token, this.accessTokenSecretKey);
  };

  static verifyRefreshToken(token: string): string | JWT.JwtPayload | any {
    return JWT.verify(token, this.refreshTokenSecretKey);
  };

  static verifyEmailVerificationToken(token: string): string | JWT.JwtPayload | any {
    return JWT.verify(token, this.emailVerificationTokenSecretKey)
  }

  static verifyForgetPasswordToken(token: string): string | JWT.JwtPayload | any {
    try {
      return JWT.verify(token, this.forgetPasswordTokenSecretKey);
    }
    catch(error: any) {
      if(error.message = 'jwt expired') {
        throw new APIError('Your link has been expired, try to ask another link and try again', HttpStatusCode.BadRequest);
      }
      throw error;
    }
  }

  static decode(token: string): any {
    return JWT.decode(token);
  };

  static isTokenExpired(token: string): boolean {
    const {exp} = JWTGenerator.decode(token) as JwtPayload;
    if(exp) {
      if(exp < Math.floor(Date.now() / 1000)) {
        return true;
      }
    }
    return false;
  };
} 