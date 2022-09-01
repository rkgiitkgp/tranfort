import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { PinoTypeormLogger } from './common/pino-typeorm.logger';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { v4 } from 'uuid';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { LoadModule } from './load/load.module';
import { StateCityZipcodeModule } from './state-city-zipcode/state-city-zipcode.module';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'transfort',
        level: 'info',
        prettyPrint: false,
        genReqId: () => v4(),
        serializers: {
          req: req => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            param: req.param,
          }),
        },
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (
        logger: PinoLogger,
        configService: ConfigService,
      ): TypeOrmModuleOptions => {
        logger.setContext('wms');
        return {
          name: 'default',
          type: 'postgres',
          host: process.env.DB_HOST,
          port: configService.get('DB_PORT'),
          username: process.env.DB_USERNAME,
          password: process.env.PASSWORD,
          database: process.env.DATABASE,
          entities: ['dist/**/*.entity{ .ts,.js}'],
          synchronize: false,
          migrations: ['dist/migrations/*{.ts,.js}'],
          migrationsTableName: 'migrations_typeorm',
          migrationsRun: true,
          namingStrategy: new SnakeNamingStrategy(),
          logger: new PinoTypeormLogger(logger),
        };
      },
      imports: [ConfigModule],
      inject: [PinoLogger, ConfigService],
    }),
    AuthModule,
    HttpModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    VehicleModule,
    LoadModule,
    StateCityZipcodeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
