import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format, Logger } from 'winston';
import LokiTransport = require('winston-loki');

@Injectable()
export class AppLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      // Usar formatos diferentes para console e Loki:
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),               // cores para os níveis
            format.timestamp({ format: 'HH:mm:ss' }),
            format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level}: ${message}` + (context ? ` [${context}]` : '');
            }),
          ),
        }),
        new LokiTransport({
          host: 'http://127.0.0.1:3100',
          json: true,
          labels: { app: 'meu-app-nest' },
          replaceTimestamp: true,
          onConnectionError: (err) => console.error('Loki connection error:', err),
        })

      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
