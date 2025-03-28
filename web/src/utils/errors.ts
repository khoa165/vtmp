export class ResourceNotFoundError extends Error {
  public metadata: { status: number };

  constructor(message: string, metadata: { status: number } = { status: 404 }) {
    super(message);
    this.name = 'ResourceNotFoundError';
    this.metadata = metadata;
  }
}

export class UnauthorizedError extends Error {
  public metadata: { status: number };

  constructor(message: string, metadata: { status: number } = { status: 401 }) {
    super(message);
    this.name = 'UnauthorizedError';
    this.metadata = metadata;
  }
}
export class ForbiddenError extends Error {
  public metadata: { status: number };

  constructor(message: string, metadata: { status: number } = { status: 403 }) {
    super(message);
    this.name = 'ForbiddenError';
    this.metadata = metadata;
  }
}
