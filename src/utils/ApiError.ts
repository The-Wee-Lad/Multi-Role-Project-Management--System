import { ErrorCode, ErrorDetail } from './errorCode';

class ApiError extends Error {
  statusCode: number;
  customErrorCode?: ErrorCode;
  detail?: ErrorDetail[];
  constructor(
    statusCode: number,
    message: string,
    customErrorCode: ErrorCode,
    detail?: ErrorDetail[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.customErrorCode = customErrorCode;
    this.detail = detail;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
