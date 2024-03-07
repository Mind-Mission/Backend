import { Application } from 'express';
import app from "./Express";
import prisma from '../../domain/db';

class ServerCreator {
	private static port = process.env.PORT || 8080;		
	static create = (app: Application) => app.listen(this.port, async () => {
		await prisma.$connect();
		console.log(`App is running at: http://localhost:${this.port} 🚀`);
	})
};

const server = ServerCreator.create(app);

export default server;