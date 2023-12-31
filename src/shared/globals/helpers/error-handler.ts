import HTTP_STATUS from "http-status-codes";
export interface IErrorResponse {
	status: string;
	statusCode: number;
	message: string;
	serializeErrors(): IError;
}

export interface IError {
	status: string;
	statusCode: number;
	message: string;
}

export abstract class CustomError extends Error {
	abstract status: string;
	abstract statusCode: number;

	constructor(message: string) {
		super(message);
	}

	serializeErrors(): IError {
		return {
			message: this.message,
			status: this.status,
			statusCode: this.statusCode,
		};
	}
}

export class JoiRequestValidationError extends CustomError {
	statusCode = HTTP_STATUS.BAD_REQUEST;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class BadRequestError extends CustomError {
	statusCode = HTTP_STATUS.BAD_REQUEST;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends CustomError {
	statusCode = HTTP_STATUS.NOT_FOUND;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class NotAuthorizedError extends CustomError {
	statusCode = HTTP_STATUS.UNAUTHORIZED;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class ServerError extends CustomError {
	statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}
