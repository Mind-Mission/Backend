import express from "express"
import cors from 'cors';
import compression from 'compression';
import app from "./factory/Express";
import server from "./factory/ServerCreator";
import Logger from "./logger";
import container from "./DIContainer/DI";
import { RealTimeManager } from "./services/RealTimeManager";
import notFoundRoutes from "./errorHandlers/NotFoundRoutesHandler";
import GlobalError from "./errorHandlers/GlobalErrorHandler"
import UnhandledRejection from "./errorHandlers/UnhandledRejectionHandler";
import { routeMounting } from "./routeMounting";
import { upsertMainSuperAdmin, seeding } from "./seed";

app.use(cors());
app.options('*', cors());
app.use(express.json({limit: "50kb"}));
app.use(Logger());
app.use(compression());

// container.get<RealTimeManager>('RealTimeManager');

// upsertMainSuperAdmin();
// seeding();

routeMounting(app);

app.all('*', notFoundRoutes.catchRoute);

app.use(GlobalError.catchError);

UnhandledRejection.catchError(server);