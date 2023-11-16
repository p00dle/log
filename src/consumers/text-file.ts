import { createDirIfNotExist } from '../lib/createDirIfNotExist';
import type { LogConsumer } from '../types';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

type WriteFile = (filePath: string, content: string, params: { flag: 'a'; encoding: 'utf8' }) => Promise<any>;

export const textFileLogConsumerFactory = function (filePath: string, writeFile: WriteFile = fs.writeFile): LogConsumer<string> {
  let writing = false;
  let dirCreated = false;
  let backlog: string[] = [];

  async function writeToFile() {
    if (!dirCreated) {
      await createDirIfNotExist(path.dirname(filePath));
      dirCreated = true;
    }
    if (backlog.length === 0) return;
    writing = true;
    const content = backlog.join('\n') + '\n';
    backlog = [];
    await writeFile(filePath, content, { flag: 'a', encoding: 'utf8' });
    writing = false;
    writeToFile();
  }
  return (logString, logLevel) => {
    if (logLevel !== 'silent') {
      backlog.push(logString);
      if (!writing) process.nextTick(writeToFile);
    }
  };
};
