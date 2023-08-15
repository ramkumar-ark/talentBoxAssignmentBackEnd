import express, { Express } from "express";

import { Server } from "@root/setupServer";
import databaseConnection from "@root/setupDatabase";
import { config } from "@root/config";

class App {
	public initialize(): void {
		this.loadConfig();
		databaseConnection();
		const app: Express = express();
		const server: Server = new Server(app);
		server.start();
	}

	private loadConfig(): void {
		config.validateConfig();
	}
}

const application: App = new App();
application.initialize();
