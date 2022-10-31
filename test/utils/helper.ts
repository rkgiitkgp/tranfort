// Shell command for setup
// npm install -g node-fetch

// Start app and run
// node test.js

const fetch = require('node-fetch');
const { exit } = require('process');
const { RepositoryNotTreeError } = require('typeorm');
const baseUrl = process.env.baseUrl;
import * as utils from './utils';

const randomInt = () => Math.ceil(Math.random() * 9999);

const tenantName = 'tenant' + utils.randomNum();
const credential = {
  tenantName,
  userName: 'User1',
  email: 'User1@' + tenantName + '.com',
  phoneNumber: `9${utils.phoneNumber()}`,
  password: 'User1@' + tenantName + '.com',
};

const commonIds = {
  token: '',
  cityId: '',
  stateId: '',
  zipcodeId: '',
  userId: '',
  vehicleId: '',
  loadId: '',
};

const setEmptyIds = commonIds => {
  Object.keys(commonIds).forEach(key => {
    commonIds[key] = '';
  });
};
const generateJWTToken = async credentials => {
  const signin = await utils.postAndGetResponse('/auth/signin', {
    phoneNumber: credentials.phoneNumber,
    password: credentials.password,
  });
  const token = signin.token;
  commonIds.userId = signin.user.id;
  process.env.token = token;
  expect(signin.user.mobile).toBe(credentials.phoneNumber);
  expect(signin.user.name).toBe(credentials.name);
  return token;
};

export const setCredentials = async credentials => {
  credentials = credentials ? credentials : credential;
  const userSignup = await utils.postAndGetResponse(
    '/auth/signup',
    credentials,
  );
  const token = await generateJWTToken(credentials);
  commonIds.token = token;
  commonIds.userId = userSignup.id;
};

export const commonData = async credentials => {
  commonIds.stateId = await utils.postAndGetId('/state', {
    name: 'Maharashtra' + utils.randomNum(),
    GST: 18,
  });
  commonIds.cityId = await utils.postAndGetId('/city', {
    name: 'Mumbai' + utils.randomNum(),
    stateId: commonIds.stateId,
  });
  commonIds.zipcodeId = await utils.postAndGetId('/zipcode', {
    code: `123${utils.randomNum()}`,
    cityId: commonIds.cityId,
  });

  return commonIds;
};
