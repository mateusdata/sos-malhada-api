import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const start = Date.now();

        res.on('finish', () => {
            const ms = Date.now() - start;
            const { statusCode } = res;
            const msg = `${method} ${originalUrl} - ${statusCode} - ${ms}ms`;

            if (statusCode >= 500) {
                this.logger.error(msg);
            } else if (statusCode >= 400) {
                this.logger.error(msg);
            } else if (statusCode >= 300) {
                this.logger.log(msg); // ou DEBUG, se quiser menos poluição
            } else {
                this.logger.log(msg); // 1xx e 2xx também aqui
            }
        });

        next();
    }
}
