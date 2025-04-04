export enum ErrorCode {
  BAD_MUTATION = 'BAD_MUTATION',
}

export class ErrorWithCode extends Error {
  public readonly code: ErrorCode;
  protected constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}

export class UserFacingError extends ErrorWithCode {
  /** A message shown to the user, used for custom error messaging in the client. */
  public readonly userMessage: string | undefined;
  protected constructor(
    message: string,
    code: ErrorCode,
    userMessage?: string
  ) {
    super(message, code);
    this.userMessage = userMessage;
  }
}

export class BadMutationError extends UserFacingError {
  public constructor(
    message: string,
    public metadata?: unknown,
    userMessage?: string
  ) {
    super(message, ErrorCode.BAD_MUTATION, userMessage);
  }
  public override toString(): string {
    return JSON.stringify({ message: this.message, metadata: this.metadata });
  }
}
