import express from "express"
import cors from 'cors';
import compression from 'compression';
import app from "./factory/Express";
import server from "./factory/ServerCreator";
import Logger from "./logger";
import container from "./DIContainer/DI";
import { RealTimeManager } from "./services/RealTimeManager";
import NotFoundRoutes from "./errorHandlers/NotFoundRoutesHandler";
import GlobalError from "./errorHandlers/GlobalErrorHandler"
import UnhandledRejection from "./errorHandlers/UnhandledRejectionHandler";
import { router } from "./router";
import { upsertMainSuperAdmin, seeding } from "./seed";

async function bootstrap() {
  app.use(cors());
  app.options('*', cors());
  app.use(express.json({limit: "50kb"}));
  app.use(Logger());
  app.use(compression());
  // container.get<RealTimeManager>('RealTimeManager'); // to run the realtime service
  router(app); 
  app.all('*', NotFoundRoutes.catch);
  app.use(GlobalError.catch);
  UnhandledRejection.catch(server);

  // await upsertMainSuperAdmin();
  // await seeding();
};

bootstrap();