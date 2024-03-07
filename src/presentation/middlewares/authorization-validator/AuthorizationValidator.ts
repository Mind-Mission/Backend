import { Crud, Resource, Role } from "@prisma/client";
import { Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {inject, injectable} from "inversify";
import {IUserService} from "../../../application/interfaces/IServices/IUserService";
import { ExtendedRequest } from "../../types/ExtendedRequest";
import { JWTGenerator } from "../../../application/helpers/JWTGenerator";
import APIError from "../../errorHandlers/APIError";
import HttpStatusCode from "../../enums/HTTPStatusCode";

@injectable()
export class Authorization { 

  constructor(@inject('IUserService') private userService: IUserService) {}

  private isCurrentUserRoleInList = (request: ExtendedRequest, roleList: Role[]): boolean => {
    return roleList.some(role => request.user?.roles.includes(role));
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
      const payload = JWTGenerator.verifyAccessToken(token);
      // if(!user || this.isTokenCreatedBeforeUpdatingPassword(payload, user.passwordUpdatedTime)) {
      //   throw new APIError("Unauthorized, try to login again", HttpStatusCode.Unauthorized);
      // }
      request.user = payload;
      next();
    }
  });
  
  isAuthorized = (resource: Resource, crud: Crud) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(request.user?.isBlocked || request.user?.isDeleted) {
      throw new APIError('Your are blocked, try to contact with our support team', HttpStatusCode.Forbidden);
    }
    if(request.user?.permissions) {
      for(const permission of request.user?.permissions) {
        if(permission.resource === resource && permission.cruds.includes(crud)) {
          next();
          return;
        }
      }
    }
    throw new APIError(`Not Allowed to ${crud.toLowerCase()} ${resource}`, HttpStatusCode.Forbidden);
  });
  
  isCurrentUserRoleInWhiteList = (...roleWhiteList: Role[]) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(!this.isCurrentUserRoleInList(request, roleWhiteList)) {
      throw new APIError('Not allow to access this route', HttpStatusCode.Forbidden);
    }
    next();
  });

  isCurrentUserRoleInBlackList = (...roleBlackList: Role[]) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(this.isCurrentUserRoleInList(request, roleBlackList)) {
      throw new APIError('Not allow to access this route', HttpStatusCode.Forbidden);
    }
    next();
  });
  
  isParamIdEqualCurrentUserId = (userId = 'id') => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => { 
    if(request.user && +request.params[userId] !== request.user.id && this.isCurrentUserRoleInList(request, ['Instructor', 'Student'])) {
      // request.params[userId] = request.user?.id.toString() || ''
      throw new APIError('Not allow to access this route, the Id in route not match the Id of the current user', HttpStatusCode.Forbidden);
    }
    next();
  });
  
  restrictedUpdateForAdminOnly = (restrictedProperties: string[]) => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
    if(!request.user?.admin) {
      for(const property of restrictedProperties) {
        delete request.body.input[property];
      }
    };
    next();
  });
}

