export class httpError extends Error {
  statusCode: number;
  errors: Array<Record<string, any>> | null;
  constructor(message: string, statusCode: number = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, httpError.prototype);
  }
}
