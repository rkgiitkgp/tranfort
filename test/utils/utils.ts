const fetch = require('node-fetch');
const crypto = require('crypto');

export const randomNum = () => crypto.randomBytes(36).toString('hex');

export const phoneNumber = () =>
  Math.floor(100000000 + Math.random() * 900000000);

export const randomInt = () => Math.ceil(Math.random() * 9999);

const getBaseUrl = () => (process.env.baseUrl = 'http://localhost:3000');

const getToken = () => process.env.token;
