import app from "./Express";
import HttpStatusCode from "../enums/HTTPStatusCode";

app.get('/', (request, response, next) => {
  response.status(HttpStatusCode.OK).send('Welcome!');
});