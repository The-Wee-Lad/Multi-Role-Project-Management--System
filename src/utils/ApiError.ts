import { ErrorCode } from "./errorCode";

class ApiError extends Error {
  statusCode: number;
  customErrorCode?: ErrorCode;
  constructor(statusCode: number, message: string, customErrorCode: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.customErrorCode = customErrorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
