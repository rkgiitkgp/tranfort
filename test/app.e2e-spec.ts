import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { setupEnv } from './utils/env.setup';
import { setCredentials, commonData } from './utils/helper';
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
  it('transporter', async done => {
    const userName = 'user' + utils.randomNum();
    const credentials = {
      name: userName,
      email: userName + '@mail.com',
      phoneNumber: '963456' + utils.randomNum(),
      password: 'User@1234',
      type: 'transporter',
    };
    await setCredentials(credentials);
    const commonIds = await commonData(credentials);
    const lineItem = {
      productName: 'Test',
      sku: 'Test',
      weight: 20,
      weightUnit: 'kilometer',
      additionalMeasureUOM: 'km',
      additionalMeasureValue2: 20,
    };
    const sourceAddress = {
      isDefault: false,
      address: 'Test Source Address',
      cityId: commonIds.cityId,
      stateId: commonIds.stateId,
      zipcodeId: commonIds.zipcodeId,
      country: 'India',
    };
    const destinationAddress = {
      isDefault: false,
      address: 'Test Destination Address',
      cityId: commonIds.cityId,
      stateId: commonIds.stateId,
      zipcodeId: commonIds.zipcodeId,
      country: 'India',
    };
    commonIds.loadId = await utils.postAndGetId('/load', {
      lineItems: [lineItem],
      sourceAddress,
      destinationAddress,
      priceRate: 100,
      vehicleRequirement: ['sedan'],
      advancePayment: 60,
      totalPrice: 110,
    });
    done();
  });
  afterAll(async () => await app.close());
});
