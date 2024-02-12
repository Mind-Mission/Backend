import { NextFunction, Request, Response } from 'express';
import asyncHandler from'express-async-handler';

export abstract class RequestBodyModifier {

  static add = (...InsertObjects: {[key: string]: any}[]) => asyncHandler((request: Request, response: Response, next: NextFunction) => {
    for(const object of InsertObjects) {
      request.body.input = {
        ...request.body.input,
        ...object
      }
    }
    next();
  });

  static remove = (...keys: string[]) => asyncHandler((request: Request, response: Response, next: NextFunction) => {
    for(const key of keys) {
      delete request.body.input[key];
    }
    next();
  });
}