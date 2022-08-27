import { Logger, QueryRunner } from 'typeorm';
import { PinoLogger } from 'nestjs-pino/dist';
import { getRequestContext } from './request.context';

export class PinoTypeormLogger implements Logger {
  constructor(private readonly logger: PinoLogger) {}

  async logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const reqContext = await getRequestContext();
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.info(sql);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.debug(sql);
    this.logger.error(error);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.info(sql);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  log(
    level: 'log' | 'info' | 'warn' | 'query',
    message: any,
    queryRunner?: QueryRunner,
  ) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
