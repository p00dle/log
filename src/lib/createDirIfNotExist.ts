import * as path from 'node:path';
import * as fs from 'node:fs/promises';

export async function createDirIfNotExist(dir: string) {
  if (path.resolve(dir) === path.resolve(dir, '..')) return;
  try {
    const stats = await fs.stat(dir);
    if (stats.isDirectory()) return;
  } catch {
    await createDirIfNotExist(path.join(dir, '..'));
    await fs.mkdir(dir);
  }
}
