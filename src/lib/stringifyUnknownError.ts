export function stringifyUnknownError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error.toString === 'function') return error.toString();
  return String(error);
}
