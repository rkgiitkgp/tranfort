const { GenericContainer, Wait } = require('testcontainers');
const { Client } = require('pg');

let container;
export const setupEnv = async () => {
  container = await new GenericContainer('postgres', 'alpine')
    .withEnv('POSTGRES_USER', 'postgres')
    .withEnv('POSTGRES_PASSWORD', 'postgres')
    .withExposedPorts(5432)
    .start();
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = container.getMappedPort(5432);
  process.env.USERNAME = 'postgres';
  process.env.PASSWORD = 'postgres';
  process.env.ENTITY_PATHS = __dirname + '/../../**/**.entity{.ts,.js}';

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: 'postgres',
  });
  await client.connect();

  await client.query('create database transfort');
  await client.query('DROP EXTENSION IF EXISTS "uuid-ossp"');
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await client.query("CREATE ROLE app_user LOGIN PASSWORD 'test'");
  await client.end();
};
