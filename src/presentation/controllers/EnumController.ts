import { Request, Response, NextFunction } from "express";
import { $Enums } from "@prisma/client";
import { injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class EnumController {
	constructor() {};

  getAllEnums = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Enums are retrieved successfully', [$Enums]));
  });
}