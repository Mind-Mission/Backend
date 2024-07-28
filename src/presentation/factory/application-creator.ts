import { Server } from 'http';
import express, { Application, RequestHandler } from 'express';
import cors, { CorsOptions } from 'cors';
import compression, { CompressionOptions } from 'compression';
import Logger from '../logger';
import NotFoundRoutes from '../errorHandlers/NotFoundRoutesHandler';
import GlobalErrorHandler from '../errorHandlers/GlobalErrorHandler';
import UnhandledRejectionHandler from '../errorHandlers/UnhandledRejectionHandler';
import container from '../DIContainer/DI';
import { RealTimeManager } from '../services/RealTimeManager';

export class ApplicationCreator {
	private static app: Application;
	private static server: Server
	private static instance: ApplicationCreator;
	private prefix: string = '';
	private runTimeController!: {
		provider: string;
		Controller:  new (...args: any[]) => any;
	};
	
	private constructor() {
		ApplicationCreator.app = express();
		ApplicationCreator.instance = this;
	}
	
	static create () {
		return ApplicationCreator.instance || new ApplicationCreator();
	}

	static getServer() {
		return ApplicationCreator.server;
	}

	setGlobalPrefix(prefix: string) {
		this.prefix = prefix.startsWith('/') ? prefix : '/' + prefix;
		this.prefix = this.prefix.endsWith('/') ? this.prefix : this.prefix + '/';
	}

	routing(routes: any[]) {
		routes.forEach(({path, router}) => {
			ApplicationCreator.app.use(this.prefix + path, router)
		})
		ApplicationCreator.app.all('*', NotFoundRoutes.catch);
		ApplicationCreator.app.use(GlobalErrorHandler.catch);
	}

	enableLimitation(limit: number| string) {
		ApplicationCreator.app.use(express.json({limit: typeof limit === 'number' ? limit + 'kb' : limit}));
	}

  enableCors(options?: CorsOptions) {
    ApplicationCreator.app.use(cors(options));
    ApplicationCreator.app.options('*', cors(options));
  };

	enableRealTime(realTimeController:{ provider: string, Controller: new (...args: any[]) => any}) {
		this.runTimeController = {...realTimeController};
	}

	compression(options?: CompressionOptions) {
    ApplicationCreator.app.use(compression(options))
  };

	enableLogger(loggerMiddleware?: RequestHandler) {
		ApplicationCreator.app.use(loggerMiddleware || Logger());
	}

	async listen(port: number | string) {
		ApplicationCreator.server = await ApplicationCreator.app.listen(port);
		if(this.runTimeController) {
			const {provider, Controller} = this.runTimeController;
			container.get<typeof Controller>(provider);
		}
		UnhandledRejectionHandler.catch(ApplicationCreator.server);
		return ApplicationCreator.server;
	}
};