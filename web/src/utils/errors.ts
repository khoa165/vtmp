export default class ResouceNotFoundError extends Error {
  public readonly metadata: { status: number };

  constructor(message: string, metadata: { status: number }) {
    super(message);
    this.name = 'ResouceNotFoundError';
    this.metadata = metadata;
  }
}
