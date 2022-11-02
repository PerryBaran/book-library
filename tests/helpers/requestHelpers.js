const request = require('supertest');
const app = require('../../src/app');

const appPost = async (path, data) => {
  try {
    return await request(app).post(path).send(data);
  } catch (err) {
    throw new Error(err);
  }
};

const appGet = async (path) => {
  try {
    return await request(app).get(path).send();
  } catch (err) {
    throw new Error(err);
  }
};

const appPatch = async (path, data) => {
  try {
    return await request(app).patch(path).send(data);
  } catch (err) {
    throw new Error(err);
  }
};

const appDelete = async (path) => {
  try {
    return await request(app).delete(path);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { appPost, appGet, appPatch, appDelete };
