export class ErrorHandlerClass {
    constructor(message, statusCode, stack, data) {
        this.message = message;
        this.statusCode = statusCode;
        this.stack = stack || null;
        this.data = data || "Error";
    }
}
