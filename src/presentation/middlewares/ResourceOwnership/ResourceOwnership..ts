import { Response, NextFunction } from "express";
import { injectable, unmanaged } from "inversify";
import asyncHandler from 'express-async-handler';
import container from "../../DIContainer/DI";
import { IResourceOwnershipService } from "../../../application/interfaces/IServices/i-resource-ownership.service";
import { ExtendedRequest } from "../../types/ExtendedRequest";
import APIError from "../../errorHandlers/APIError";
import HttpStatusCode from "../../enums/HTTPStatusCode";

@injectable()
export class ResourceOwnership<T> {
  private resourceOwnership: IResourceOwnershipService<T>;
  constructor(@unmanaged() private resource: 'Course' | 'Section' | 'Lesson' | 'Article' | 'Video' | 'Quiz' | 'Coupon') {
    this.resourceOwnership = container.get<IResourceOwnershipService<T>>(`IResourceOwnership<${this.resource}>`);
  }

  isResourceBelongsToCurrentUser = (field: string = 'id', place: 'body' | 'params' = 'params') => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
    let resourceIds = place ==='params' ? +request.params[field] : request.body.input[field];
    if(resourceIds) {
      resourceIds = Array.isArray(resourceIds) ? resourceIds : [resourceIds];
      const isBelongsToCurrentUser = await this.resourceOwnership.isResourceBelongsToCurrentUser(request.user as any, ...resourceIds);
      if(!isBelongsToCurrentUser) {
        throw new APIError(`This ${this.resource.toLowerCase()} is not yours`, HttpStatusCode.Forbidden);
      }
    }
    next();
  });
}