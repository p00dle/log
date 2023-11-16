import * as path from 'node:path';
import { createDirIfNotExist } from '../lib/createDirIfNotExist';
import type { LogConsumer, LogDetails } from '../types';
import type { Database } from 'sqlite3';

type DbFactory = (filePath: string, callback: (err: unknown | null, db: Database) => void) => void;

const defaultDbFactory: DbFactory = (filePath, callback) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sqlite3 = require('sqlite3');
    const db: Database = new sqlite3.Database(filePath, (err: unknown) => callback(err, db));
  } catch {
    throw new Error('sqlite3 not installed');
  }
};

export const sqliteLogConsumerFactory = function (
  filePath: string,
  logRetentionPeriodDays = -1,
  logPurgeIntervalHours = -1,
  dbFactory: DbFactory = defaultDbFactory
): LogConsumer<LogDetails> {
  let dbInitiating = false;
  let dbCache: Database | null = null;
  let dbInitCallbacks: ((err: unknown | null, db: Database) => void)[] = [];

  function getDb(filePath: string, callback: (err: unknown | null, db: Database) => void): void {
    if (dbCache) {
      callback(null, dbCache);
    } else if (!dbInitiating) {
      dbInitiating = true;
      createDirIfNotExist(path.dirname(filePath)).then(
        () =>
          dbFactory(filePath, (err, db) => {
            if (err) return callback(err, null as unknown as Database);
            createTableIfNotExist(db, (err) => {
              if (err) return callback(err, null as unknown as Database);
              dbInitiating = false;
              dbCache = db;
              callback(null, db);
              dbInitCallbacks.forEach((cb) => cb(null, db));
              dbInitCallbacks = [];
            });
          }),
        (err) => callback(err, null as unknown as Database)
      );
    } else {
      dbInitCallbacks.push(callback);
    }
  }

  function removeOldLogs() {
    getDb(filePath, (err, db) => {
      if (err) return console.error(err);
      const $date = stringifyDate(new Date(Date.now() - logRetentionPeriodDays * 24 * 60 * 60 * 1000));
      db.run(`DELETE FROM logs WHERE timestamp < $date;`, { $date }, () =>
        setTimeout(removeOldLogs, logPurgeIntervalHours * 60 * 60 * 1000)
      );
    });
  }

  if (logRetentionPeriodDays >= 1 && logPurgeIntervalHours >= 1) removeOldLogs();

  return (details, level) => {
    if (level === 'silent') return;
    const sqlParams = {
      $timestamp: stringifyDate(details.timestamp),
      $level: details.logLevel,
      $message: details.message,
      $namespace: details.namespace.join('/'),
      $details: details.details ? JSON.stringify(details.details, null, 2) : '',
    };
    getDb(filePath, (err, db) => {
      if (err) throw err;
      db.run(
        `INSERT INTO logs 
        (timestamp, level, namespace, message, details) 
        VALUES 
        ($timestamp, $level, $namespace, $message, $details);`,
        sqlParams,
        (err) => (err ? console.error(err) : void 0)
      );
    });
  };
};

function createTableIfNotExist(db: Database, callback: (err: unknown | null) => void): void {
  db.run(
    `CREATE TABLE IF NOT EXISTS logs (
        timestamp TEXT NOT NULL,
        level TEXT NOT NULL,
        namespace TEXT,
        message TEXT,
        details TEXT
      );    
    `,
    callback
  );
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const pad3 = (n: number) => String(n).padStart(3, '0');

function stringifyDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    '-',
    pad2(date.getUTCMonth() + 1),
    '-',
    pad2(date.getUTCDate()),
    ' ',
    pad2(date.getUTCHours()),
    ':',
    pad2(date.getUTCMinutes()),
    ':',
    pad2(date.getUTCSeconds()),
    '.',
    pad3(date.getUTCMilliseconds()),
  ].join('');
}
