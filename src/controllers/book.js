const helpers = require('./helpers');

exports.create = async (req, res) => {
  const { body } = req;

  try {
    await helpers.create(body, res, 'book');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'book');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readById = async (req, res) => {
  const { bookId } = req.params;

  try {
    await helpers.readById(bookId, res, 'book');
  } catch (err) {
    throw new Error(err);
  }
};

exports.update = async (req, res) => {
  const {
    body,
    params: { bookId },
  } = req;

  try {
    await helpers.update(body, bookId, res, 'book');
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete = async (req, res) => {
  const { bookId } = req.params;

  try {
    await helpers.delete(bookId, res, 'book');
  } catch (err) {
    throw new Error(err);
  }
};
