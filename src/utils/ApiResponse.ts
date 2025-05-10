import { ErrorCode } from "./errorCode.js";

class ApiResponse {
  statusCode: number;
  message: string;
  customErrorCode?: ErrorCode;
  success: boolean;
  data: any;
  constructor(
    statusCode: number,
    message: string,
    data: any,
    customErrorCode?: ErrorCode
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.customErrorCode = customErrorCode;
    this.data = data;
  }
}

export { ApiResponse };
