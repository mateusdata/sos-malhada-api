import pino from 'pino';
import type { LokiOptions } from 'pino-loki';

const transportador = pino.transport<LokiOptions>({
  target: 'pino-loki',
  options: {
    host: process.env.LOKI_HOST || 'http://localhost:3100',
    basicAuth: {
      username: process.env.LOKI_USERNAME || 'usuario',
      password: process.env.LOKI_PASSWORD || 'senha',
    },
    labels: { app: 'malhada-floods-api' },
    batching: true,
    interval: 5,
  },
});

export const logger = pino(transportador);
