import mongoose from "mongoose";
import Logger from "bunyan";

import { config } from "@root/config";

const log: Logger = config.createLogger("setupDatabase");

export default () => {
	const connect = () => {
		mongoose
			.connect(config.DATABASE_URI!)
			.then(() => {
				log.info("Connected to database");
			})
			.catch((error) => {
				log.error("Error Connecting to Database", error);
				return process.exit(1);
			});
	};
	connect();
	mongoose.connection.on("disconnected", connect);
};
