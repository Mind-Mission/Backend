import express from 'express';
import HttpStatusCode from "../enums/HTTPStatusCode";

const welcomeRoute = express.Router();

welcomeRoute.get('/', (request, response, next) => {
  response.status(HttpStatusCode.OK).send('Welcome!');
});

export default welcomeRoute;