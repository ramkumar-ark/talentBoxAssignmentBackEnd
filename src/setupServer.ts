import {
	Application,
	json,
	urlencoded,
	Response,
	Request,
	NextFunction,
} from "express";
import { Server as HttpServer } from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import compression from "compression";
import Logger from "bunyan";

import { config } from "@root/config";
import appRoutes from "@root/routes";
import { CustomError, IErrorResponse } from "@globals/helpers/error-handler";

const logger: Logger = config.createLogger("setupServer");

export class Server {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	public start() {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application) {
		app.use(
			cookieSession({
				name: "sessionToken",
				keys: [config.COOKIE_SESSION_KEY1!, config.COOKIE_SESSION_KEY2!],
				secure: config.NODE_ENV === "production",
			})
		);
		app.use(
			cors({
				origin: config.CLIENT_URL,
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			})
		);
		app.use(hpp());
		app.use(helmet());
	}

	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: "50mb" }));
		app.use(urlencoded({ extended: true, limit: "50mb" }));
	}

	private routesMiddleware(app: Application) {
		appRoutes(app);
	}

	private globalErrorHandler(app: Application) {
		app.all("*", (req: Request, res: Response) => {
			res
				.status(HTTP_STATUS.NOT_FOUND)
				.json({ message: `${req.originalUrl} not found!` });
		});
		app.use(
			(
				error: IErrorResponse,
				_req: Request,
				res: Response,
				next: NextFunction
			) => {
				if (error instanceof CustomError)
					return res.status(error.statusCode).json(error.serializeErrors());
				next();
			}
		);
	}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: HttpServer = new HttpServer(app);
			this.startHttpServer(httpServer);
		} catch (error) {
			logger.error(error);
		}
	}

	private startHttpServer(httpServer: HttpServer): void {
		logger.info(`Server has started with process ${process.pid}`);
		httpServer.listen(config.SERVER_PORT_NO, () => {
			logger.info("server is listening at port ", config.SERVER_PORT_NO);
		});
	}
}
