import express from "express"
import cors from 'cors';
import compression from 'compression';
import app from "./config/Express";
import server from "./config/ServerCreator";
import Logger from "./logger";
import container from "./DIContainer/DI";
import { RealTimeManager } from "./services/RealTimeManager";
import notFoundRoutes from "./errorHandlers/NotFoundRoutesHandler";
import GlobalError from "./errorHandlers/GlobalErrorHandler"
import UnhandledRejection from "./errorHandlers/UnhandledRejectionHandler";
import { routeMounting } from "./routeMounting";
import { upsertMainItemsIntoDB } from "../infrastructure/config/upsertMainItemsIntoDB";
import { seeding } from "./seed";

app.use(cors());
app.options('*', cors());
app.use(express.json({limit: "50kb"}));
app.use(Logger());
app.use(compression());

// container.get<RealTimeManager>('RealTimeManager');

// upsertMainItemsIntoDB();
// seeding();

routeMounting(app);

app.all('*', notFoundRoutes.catchRoute);

app.use(GlobalError.catchError);

UnhandledRejection.catchError(server);