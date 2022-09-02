const fetch = require('node-fetch');
const crypto = require('crypto');

export const randomNum = () => Math.ceil(Math.random() * 9999);

export const phoneNumber = () =>
  Math.floor(100000000 + Math.random() * 900000000);

export const randomInt = () => Math.ceil(Math.random() * 9999);

const getBaseUrl = () =>
  (process.env.baseUrl = 'https://truck-app-hokn2gj3ta-el.a.run.app');
// https://truck-app-hokn2gj3ta-el.a.run.app
// http://localhost:3000

const getToken = () => process.env.token;
export const getResponse = async path => {
  return fetch(getBaseUrl() + path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(response => {
      console.debug({ path, response });
      if (response.statusCode) {
        console.debug({ token: getToken(), path, response });
        process.exit(1);
      }
      return response;
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
};

export const deleteAndGetResponse = async path => {
  console.log('token is', getToken());
  return fetch(getBaseUrl() + path, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(response => {
      console.debug({ path, response });
      if (response.statusCode) {
        console.log({
          path,
          token: getToken(),
          response,
        });
        process.exit(1);
      }
      return response;
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
};

export const putAndGetResponse = async (path, body) => {
  console.log('token is', getToken());
  return fetch(getBaseUrl() + path, {
    body: JSON.stringify(body),
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(response => {
      console.debug({ path, request: body, response });
      if (response.statusCode) {
        console.log({
          path,
          token: getToken(),
          request: JSON.stringify(body),
          response,
        });
        process.exit(1);
      }
      return response;
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
};

export const postAndGetId = async (path, body) => {
  const data = await postAndGetResponse(path, body);
  return data.id;
};

export const postAndGetResponse = async (path, body) => {
  console.log('token is', getToken());
  return fetch(getBaseUrl() + path, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(response => {
      console.debug({ path, request: body, response });
      if (response.statusCode) {
        console.log({
          path,
          token: getToken(),
          request: JSON.stringify(body),
          response,
        });
        process.exit(1);
      }
      return response;
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
};
