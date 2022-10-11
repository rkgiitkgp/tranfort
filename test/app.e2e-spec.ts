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
    await app.listen(4000);
    process.env.baseUrl = await app.getUrl();
  }, 500000);
  it('transporter', async done => {
    const transporter = 'Transporter' + utils.randomNum();
    const credentials = {
      name: transporter,
      email: transporter + '@mail.com',
      phoneNumber: '963456' + utils.randomNum(),
      password: 'Transporter@1234',
      type: 'transporter',
    };
    await setCredentials(credentials);
    const commonIds = await commonData(credentials);
    const lineItem = {
      productName: 'Test',
      sku: 'Test',
      uom: 'tonnes',
      value: 20,
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
      vehicleRequirement: {
        vehicleType: 'open_body_truck',
        subVehicleType: 'box_body',
        numberOfWheels: [
          {
            number: 10,
          },
        ],
      },
      advancePayment: 60,
      advanceInPercentage: 10,
      totalPrice: 110,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    });
    const loads = await utils.getResponse(`/load`);
    const loadById = await utils.getResponse(`/load/${commonIds.loadId}`);
    const loadList = await utils.postAndGetResponse(
      `/load/list?limit=10&page=1`,
      {
        orderBy: [
          {
            name: 'createdAt',
            order: 'DESC',
          },
        ],
      },
    );
    const truckOwner = 'Truckowner' + utils.randomNum();
    const credentials2 = {
      name: truckOwner,
      email: truckOwner + '@mail.com',
      phoneNumber: '963456' + utils.randomNum(),
      password: 'Truckowner@1234',
      type: 'truck_owner',
    };
    await setCredentials(credentials2);
    const publicLoadList = await utils.postAndGetResponse(
      `/load/list?limit=10&page=1`,
      {
        orderBy: [
          {
            name: 'createdAt',
            order: 'DESC',
          },
        ],
      },
    );
    // const loadById = await utils.getResponse(`/load/${commonIds.loadId}`);

    const postBooking = await utils.postAndGetResponse(`/booking`, {
      loadId: loadById.id,
      comments: 'I want this load as soon as possible',
    });

    const updatedPublicLoadList = await utils.postAndGetResponse(
      `/load/list?limit=10&page=1`,
      {
        orderBy: [
          {
            name: 'createdAt',
            order: 'DESC',
          },
        ],
      },
    );
    // (logged in into transporter tenant)
    const transporterSignIn = await utils.postAndGetResponse('/auth/signin', {
      phoneNumber: credentials.phoneNumber,
      password: credentials.password,
    });
    //token set
    process.env.token = transporterSignIn.token;

    const bookingAppliedList = await utils.postAndGetResponse(
      `/load/list?limit=10&page=1`,
      {
        orderBy: [
          {
            name: 'createdAt',
            order: 'DESC',
          },
        ],
      },
    );
    done();
  });
  afterAll(async () => await app.close());
});
