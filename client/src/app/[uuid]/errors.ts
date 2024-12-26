export class RecipientError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "RecipientError";
  }
}
