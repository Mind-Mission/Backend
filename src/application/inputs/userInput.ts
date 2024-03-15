import { Crud, Platform, Resource, Role, SSOPlatform } from "@prisma/client";

export type CreateUser = {
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
  roles: Role[];
  permissions: {
    resource: Resource;
    cruds: Crud[];
  }[];
  refreshToken?: string;
};

export type UpdateUser = {
  id: number;
  firstName?: string; 
  lastName?: string;
  email?: string;
  isEmailVerified?: boolean;
  emailVerificationCode?: string | null;
  password?: string;
  resetPasswordCode?: {code: string; expirationTime: number; isVerified: boolean}
  passwordUpdatedTime?: Date;
  mobilePhone?: string;
  whatsAppNumber?: string;
  bio?: string;
  picture?: string;
  permissions?: {
    id?: number,
    resource: Resource;
    cruds: Crud[];
  }[];
  roles?: Role[];
  refreshToken?: string;
  isOnline?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
  personalLinks?: {platform: Platform, link: string}[];
};