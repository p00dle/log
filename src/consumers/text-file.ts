import type { LogFormatter, LogConsumer } from '../types';

import * as fs from 'fs/promises';
import { defaultLogFormmater } from '../formatters/defaultLogFormmater';

type WriteFile = (filePath: string, content: string, params: { flag: 'a'; encoding: 'utf8' }) => Promise<any>;

export const textFileLogConsumerFactory = function (
  filePath: string,
  logFormatter: LogFormatter = defaultLogFormmater,
  writeFile: WriteFile = fs.writeFile
): LogConsumer {
  let writing = false;
  let backlog: string[] = [];

  async function writeToFile() {
    if (backlog.length === 0) return;
    writing = true;
    const content = backlog.join('\n');
    backlog = [];
    await writeFile(filePath, content, { flag: 'a', encoding: 'utf8' });
    writing = false;
    writeToFile();
  }
  return (message, logLevel, namespaces) => {
    if (logLevel !== 'silent') {
      backlog.push(logFormatter(message, logLevel, namespaces));
      if (!writing) process.nextTick(writeToFile);
    }
  };
};
