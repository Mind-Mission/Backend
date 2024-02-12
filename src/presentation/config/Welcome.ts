import express, { response } from "express";
import HttpStatusCode from "../enums/HTTPStatusCode";

const welcomeRouter = express.Router();

welcomeRouter.get('/', (request, response, next) => {
  response.status(HttpStatusCode.OK).send("Welcome!");
});

export default welcomeRouter;