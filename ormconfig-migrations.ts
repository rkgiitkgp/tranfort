import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const ORMConfig = [
  {
    name: 'default',
    type: 'postgres',
    driver: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Rakesh@123',
    database: 'transfort',
    entities: ['dist/**/*.entity{ .ts,.js}'],
    synchronize: false,
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
    logging: ['query', 'error'],
    namingStrategy: new SnakeNamingStrategy(),
  },
];
export = ORMConfig;
