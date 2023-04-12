import {
  createLogger as winstonCreateLogger,
  format,
  transports
} from 'winston';
import { config } from 'node-config-ts';

export function createLogger(requestId: string) {
  const logger = winstonCreateLogger({
    level: config.logLevel,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.align(),
      format((info) => {
        info.message = `${requestId} - ${info.message}`;
        return info;
      })(),
      format.errors({ stack: true }),
      format.splat(),
      format.simple()
    ),
    defaultMeta: { service: 'pl-bff' },
    transports: []
  });
  logger.add(new transports.Console());
  return logger;
}

const globalLogger = createLogger('global');
export { globalLogger };
