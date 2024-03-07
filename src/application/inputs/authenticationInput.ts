import {SSOPlatform } from "@prisma/client";

export type Signup = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobilePhone?: string;
  whatsAppNumber?: string;
  bio?: string;
  picture?: string;
  platform?: SSOPlatform;
  isEmailVerified?: boolean;
}

export type Login = {
  email: string;
  password?: string;
  platform: SSOPlatform;
  isSignWithSSO?: boolean;
}