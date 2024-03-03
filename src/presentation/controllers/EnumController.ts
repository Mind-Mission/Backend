import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class EnumController {
	constructor() {};

  getPublicEnums = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    Reflect.deleteProperty($Enums, 'Resource');
    Reflect.deleteProperty($Enums, 'Crud');
    Reflect.deleteProperty($Enums, 'Role');
    Reflect.deleteProperty($Enums, 'LogModel');
    Reflect.deleteProperty($Enums, 'OperationType');
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Public Enums are retrieved successfully', [$Enums]));
  });
}