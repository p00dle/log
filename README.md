### Overview

No dependency logging utility wrapper with customisable consumer

### Installation

```shell
yarn install @kksiuda/log
```

or

```shell
npm install @kksiuda/log
```

### API

#### Log

Creates a [Log](#log) instance.

- input
  - consumer?: [LogConsumer](#logconsumer) (default: consoleLogConsumerFactory return value);
  - logLevel: [LogLevel](#loglevel) (default: 'info');
  - namespace: string[]; (default: [])
- output
  - [Log](#log) instance

Example

```ts
import { Log } from '@kksiuda/logger';

const log = new Logger();
log.debug('debug data');
log.info('some information');
log.warn('warning');
log.error(new Error('error message'));
// by default these logs will be output to console using consoleLogConsumerFactory default parameters
```
