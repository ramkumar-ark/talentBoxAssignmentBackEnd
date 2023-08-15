import dotenv from "dotenv";
import bunyan from "bunyan";

dotenv.config({});

class Config {
	public COOKIE_SESSION_KEY1: string | undefined;
	public COOKIE_SESSION_KEY2: string | undefined;
	public NODE_ENV: string | undefined;
	public CLIENT_URL: string | undefined;
	public SERVER_PORT_NO: string | undefined;
	public DATABASE_URI: string | undefined;

	private readonly DEFAULT_DATABASE_URI =
		"mongodb://localhost:27017/freeCodeCamp";
	private readonly DEFAULT_ENVIRONMENT = "development";

	constructor() {
		this.COOKIE_SESSION_KEY1 = process.env.COOKIE_SESSION_KEY1;
		this.COOKIE_SESSION_KEY2 = process.env.COOKIE_SESSION_KEY2;
		this.NODE_ENV = process.env.NODE_ENV || this.DEFAULT_ENVIRONMENT;
		this.CLIENT_URL = process.env.CLIENT_URL;
		this.SERVER_PORT_NO = process.env.SERVER_PORT_NO || "1000";
		this.DATABASE_URI = process.env.DATABASE_URI || this.DEFAULT_DATABASE_URI;
	}

	public validateConfig(): void {
		for (const [key, value] of Object.entries(this)) {
			if (value === undefined)
				throw new Error(`environment variable ${key} is not provided.`);
		}
	}

	public createLogger(name: string): bunyan {
		return bunyan.createLogger({ name, level: "debug" });
	}
}

export const config: Config = new Config();
