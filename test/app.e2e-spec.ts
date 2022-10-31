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
    // sign-up: Transporter
    // create load
    // can see only his loads
    // also can see booking raised by truck owner

    // sigin-up Truck owner
    // can see all of the loads
    // can apply to a multiple loads
    // cannot apply twice to a single load

    // sign-in transporter
    // get his load details and then can approve multiple booking
    // generate challan against a load & booking
    // challan status -> material dispatched
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

    //Post a load
    commonIds.loadId = await utils.postAndGetId('/load', {
      lineItems: [lineItem],
      sourceAddress,
      destinationAddress,
      // priceRate: 100,
      vehicleRequirement: {
        vehicleType: 'open_body_truck',
        subVehicleType: 'box_body',
        numberOfWheels: [
          {
            number: 10,
          },
        ],
      },
      // advancePayment: 60,
      // advanceInPercentage: 10,
      // totalPrice: 110,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      additionalNotes: 'abc',
    });
    const loads = await utils.getResponse(`/load`);
    expect(loads.length).toBe(1);
    const loadById = await utils.getResponse(`/load/${commonIds.loadId}`);
    expect(loadById.bookings.length).toBe(0);
    expect(loadById.status).toBe('generated');
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
    expect(loadList[0].length).toBe(1);
    expect(loadList[1]).toBeInstanceOf(Object);

    //signUp: Truck Owner 1
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
    const loadById_truckOwner = await utils.getResponse(
      `/load/${commonIds.loadId}`,
    );

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

    //signUp: Truck Owner 2
    const truckOwner2 = 'Truckowner2' + utils.randomNum();
    const credTruckOwner2 = {
      name: truckOwner2,
      email: truckOwner2 + '@mail.com',
      phoneNumber: '963456' + utils.randomNum(),
      password: 'Truckowner@1234',
      type: 'truck_owner',
    };
    await setCredentials(credTruckOwner2);
    const publicLoadList2 = await utils.postAndGetResponse(
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
    const loadById_truckOwner2 = await utils.getResponse(
      `/load/${commonIds.loadId}`,
    );

    const postBooking2 = await utils.postAndGetResponse(`/booking`, {
      loadId: loadById.id,
      comments: 'I want this load as soon as possible',
    });

    const updatedPublicLoadList2 = await utils.postAndGetResponse(
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
    // total 2 booking raised
    expect(bookingAppliedList[0][0].bookings.length).toBe(2);

    //first booking assigned
    await utils.postAndGetResponse(`/load/assign-load`, {
      loadId: loadById.id,
      bookingId: postBooking.id,
    });

    //second booking assigned
    await utils.postAndGetResponse(`/load/assign-load`, {
      loadId: loadById.id,
      bookingId: postBooking2.id,
    });

    const updateLoadStatus = await utils.postAndGetResponse(
      `/load/update-status/${loadById.id}`,
      {},
    );

    const loadById2 = await utils.getResponse(`/load/${commonIds.loadId}`);
    expect(loadById2.status).toBe('booked');

    //generate chllan
    const challanLineItem = [
      {
        productName: 'Test',
        sku: 'Test',
        uom: 'tonnes',
        value: 10,
      },
    ];

    const vehicle = {
      vehicleNumber: 'asdga',
      fuelType: 'asdfa',
      model: 'asdgas',
      capacity: 'asfga',
    };

    // challan booking 1
    const challan1 = await utils.postAndGetResponse('/challan', {
      challanLineItems: challanLineItem,
      loadId: loadById2.id,
      bookingId: postBooking.id,
      driverId: loadById.id,
      vehicle,
    });

    // challan booking 1
    const challan2 = await utils.postAndGetResponse('/challan', {
      loadId: loadById2.id,
      bookingId: postBooking2.id,
      driverId: loadById2.id,
      vehicle,
      challanLineItems: challanLineItem,
    });

    done();
  });
  afterAll(async () => await app.close());
});
