export class ErrorHandlerClass {
  message: string;
  statusCode: number;
  stack?: string | null;
  data: string;

  constructor(
    message: string,
    statusCode: number,
    stack?: string | null,
    data?: string
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.stack = stack || null;
    this.data = data || "Error";
  }
}
