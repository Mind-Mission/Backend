import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../enums/HTTPStatusCode";

const Welcome = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).send('Welcome!');
  };
};

export default Welcome