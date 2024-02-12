import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {inject, injectable} from "inversify";
import {IUserService} from "../../../application/interfaces/IServices/IUserService";
import { ExtendedRequest } from "../../types/ExtendedRequest";
import { AllowedMethod, AllowedModel, AllowedModels } from "../../types/ModelPermission";
import { MainRoles } from "../../types/MainRoles";
import { JWTGenerator } from "../../services/JWTGenerator";
import APIError from "../../errorHandlers/APIError";
import HttpStatusCode from "../../enums/HTTPStatusCode";

@injectable()
export class Authorization { 

  constructor(@inject('IUserService') private userService: IUserService) {}

  private isCurrentUserRoleInList = (request: ExtendedRequest, roleList: MainRoles[]): boolean => {
    return (request?.user?.role && roleList.includes(request.user.role.slug as MainRoles)) as boolean;
  };

  private isTokenCreatedBeforeUpdatingPassword(decodedPayload: any, passwordUpdatedTime: Date | null): boolean {
    if(passwordUpdatedTime) {
      const passwordUpdatedTimeInSeconds = parseInt(`${passwordUpdatedTime.getTime() / 1000}`, 10);
      if(passwordUpdatedTimeInSeconds > decodedPayload.iat) {
        return true;
      }
    }
    return false;
  };

  isAuthenticated = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
      const token = request.headers.authorization.split(" ")[1];
      const decodedPayload = JWTGenerator.verifyAccessToken(token);
      const user = await this.userService.findFirst({
        where: {
          email: {equals: decodedPayload?.email, mode: 'insensitive'}
        },
        include: {
          role: true
        }
      });
      if(!user || this.isTokenCreatedBeforeUpdatingPassword(decodedPayload, user.passwordUpdatedTime)) {
        throw new APIError("Unauthorized, try to login again", HttpStatusCode.Unauthorized);
      }
      request.user = user;
      next();
    }
  });
  
  isAuthorized = (modelName: AllowedModel, method: AllowedMethod) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(request.user?.isBlocked || request.user?.isDeleted) {
      throw new APIError('Your are blocked, try to contact with our support team', HttpStatusCode.Forbidden);
    }
    let permission = method.toLowerCase();
    if(request.user?.role?.allowedModels) {
      for(const allowedModel of request.user?.role.allowedModels) {
        if(allowedModel.modelName.toLowerCase() === modelName.toLowerCase() && allowedModel.permissions.includes(permission)) {
          next();
          return;
        }
      }
    }
    permission = (permission === 'post') ? 'add' : (permission === 'patch') ? 'update' : (permission === 'put') ? 'get' : permission;
    throw new APIError(`Not Allowed to ${permission} ${modelName}`, HttpStatusCode.Forbidden);
  });
  
  isCurrentUserRoleInWhiteList = (...roleWhiteList: MainRoles[]) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(!this.isCurrentUserRoleInList(request, roleWhiteList)) {
      throw new APIError('Not allow to access this route', HttpStatusCode.Forbidden);
    }
    next();
  });

  isCurrentUserRoleInBlackList = (...roleBlackList: MainRoles[]) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(this.isCurrentUserRoleInList(request, roleBlackList)) {
      throw new APIError('Not allow to access this route', HttpStatusCode.Forbidden);
    }
    next();
  });
  
  isParamIdEqualCurrentUserId = (userId = 'id') => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(request.user && +request.params[userId] !== request.user.id && this.isCurrentUserRoleInList(request, ['instructor', 'student'])) {
      throw new APIError('Not allow to access this route, the Id in route not match the Id of the current user', HttpStatusCode.Forbidden);
    }
    next();
  });
  
  restrictedUpdateForAdminOnly = (restrictedProperties: string[]) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
    if(request.user?.role?.slug === AllowedModels.Instructors || request.user?.role?.slug === AllowedModels.Students) {
      for(const property of restrictedProperties) {
        delete request.body.input[property];
      }
    };
    next();
  });
}

