import { Response, NextFunction } from "express";
import { injectable, unmanaged } from "inversify";
import asyncHandler from 'express-async-handler';
import container from "../../DIContainer/DI";
import { IResourceOwnership } from "../../../application/interfaces/IServices/IResourceOwnership";
import { ExtendedRequest } from "../../types/ExtendedRequest";
import APIError from "../../errorHandlers/APIError";
import HttpStatusCode from "../../enums/HTTPStatusCode";

@injectable()
export class ResourceOwnership<T> {
  private resourceOwnership: IResourceOwnership<T>;
  constructor(@unmanaged() private resource: 'Course' | 'Section' | 'Lesson' | 'Article' | 'Video' | 'Quiz') {
    this.resourceOwnership = container.get<IResourceOwnership<T>>(`IResourceOwnership<${this.resource}>`);
  }

  isResourceBelongsToCurrentUser = (field: string = 'id', place: 'body' | 'params' = 'params') => asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
    const resourceId = place ==='params' ? +request.params[field] : request.body.input[field];
    const isBelongsToCurrentUser = await this.resourceOwnership.isResourceBelongsToCurrentUser(resourceId, request.user as any);
    if(!isBelongsToCurrentUser) {
      throw new APIError(`This ${this.resource.toLowerCase()} is not yours`, HttpStatusCode.Forbidden);
    }
    next();
  });
}