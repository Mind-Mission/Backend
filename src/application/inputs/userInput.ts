import { Crud, HaveAudience, Platform, Resource, Role, SSOPlatform, TeachingType, VideoProAcademy } from "@prisma/client";

export type CreateUser = {
  firstName: string; 
  lastName: string;
  email: string;
  password: string;
  mobilePhone: string;
  whatsAppNumber: string;
  bio: string;
  picture: string;
  platform?: SSOPlatform,
  isEmailVerified?: boolean,
  role: Role,
  permissions: {
    resource: Resource;
    cruds: Crud[];
  }[];
  refreshToken?: string;
  instructor?: {
    specialization: string;
    teachingType: TeachingType,
    videoProAcademy: VideoProAcademy,
    haveAudience: HaveAudience,
  }
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
  permissions?: [{
    id?: number,
    resource: Resource;
    cruds: Crud[];
  }];
  refreshToken?: string;
  isOnline?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
  personalLinks?: {platform: Platform, link: string}[];
};