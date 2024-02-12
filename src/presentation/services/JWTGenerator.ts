import JWT, { JwtPayload } from "jsonwebtoken"
import { ExtendedUser } from "../../application/types/ExtendedUser";

export abstract class JWTGenerator {
  private static accessTokenSecretKey: string = process.env.JWT_Access_Token_Secret_Key as string;
  private static refreshTokenSecretKey: string = process.env.JWT_Refresh_Token_Secret_Key as string;
  private static emailVerificationTokenSecretKey: string = process.env.JWT_Email_Verification_Token_Secret_Key as string;

  static generateAccessToken(user: ExtendedUser) {
    const {firstName, lastName, email, picture} = user;
    return JWT.sign({firstName, lastName, email, picture}, this.accessTokenSecretKey, {expiresIn: "3d"});
  };

  static generateRefreshToken(user: ExtendedUser) {
    const {firstName, lastName, email, picture} = user;
    return JWT.sign({firstName, lastName, email, picture}, this.refreshTokenSecretKey, {expiresIn: "30d"});
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