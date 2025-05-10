import { ErrorCode } from "./errorCode.js";

interface ErrorDetail {
  field: string;
  message: string;
}

class ApiResponse {
  statusCode: number;
  message: string;
  customErrorCode?: ErrorCode;
  success: boolean;
  data: any;
  detail?: ErrorDetail[];
  constructor(statusCode: number, message: string, data: any, customErrorCode?: ErrorCode, detail?: ErrorDetail[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.customErrorCode = customErrorCode;
    this.data = data;
    this.detail = detail;
  }
}

export { ApiResponse };
