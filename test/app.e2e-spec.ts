import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupEnv } from './utils/env.setup';
import { setRun, setCredentials, commonData } from './utils/helper';
import { enable } from 'async-local-storage';
import * as utils from './utils/utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupEnv();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    enable();
    await app.listen(3000);
    process.env.baseUrl = await app.getUrl();
  }, 500000);

}
