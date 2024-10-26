export class ErrorHandlerClass {
  message: string;
  statusCode: number;
  stack?: string | null;
  data: any;

  constructor(
    message: string,
    statusCode: number,
    stack?: string | null,
    data?: any
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.stack = stack || null;
    this.data = data || "Error";
  }
}
