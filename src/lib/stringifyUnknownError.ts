export function stringifyUnknownError(error: unknown): [string, string] {
  if (error instanceof Error) return [error.message, error.stack || ''];
  if (typeof error === 'string') return [error, ''];
  if (error && typeof error.toString === 'function') return [error.toString(), ''];
  return [String(error), ''];
}
