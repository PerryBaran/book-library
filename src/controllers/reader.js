const helpers = require('./helpers');

exports.create = async (req, res) => {
  const { body } = req;

  try {
    await helpers.create(body, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readById = async (req, res) => {
  const { readerId } = req.params;

  try {
    await helpers.readById(readerId, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.update = async (req, res) => {
  const {
    body,
    params: { readerId },
  } = req;

  try {
    await helpers.update(body, readerId, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete = async (req, res) => {
  const { readerId } = req.params;

  try {
    await helpers.delete(readerId, res, 'reader');
  } catch (err) {
    throw new Error(err);
  }
};
