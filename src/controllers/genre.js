const helpers = require('./helpers');

exports.create = async (req, res) => {
  const { body } = req;

  try {
    await helpers.create(body, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readById = async (req, res) => {
  const { genreId } = req.params;

  try {
    await helpers.readById(genreId, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.update = async (req, res) => {
  const {
    body,
    params: { genreId },
  } = req;

  try {
    await helpers.update(body, genreId, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete = async (req, res) => {
  const { genreId } = req.params;

  try {
    await helpers.delete(genreId, res, 'genre');
  } catch (err) {
    throw new Error(err);
  }
};
