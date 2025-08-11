const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new LokiTransport({
      host: 'http://localhost:3100',
      json: true,
      labels: { app: 'meu-app-nest' },
      replaceTimestamp: true,
      onConnectionError: (err) => console.error('Loki connection error:', err),
      onConnectionStatusChange: (status) => console.log('Loki connection status:', status),
    }),
    new transports.Console(),
  ],
});

logger.info('Teste simples de log', (err) => {
  if (err) {
    console.error('Erro ao enviar log:', err);
  } else {
    console.log('Log enviado com sucesso!');
  }
});
