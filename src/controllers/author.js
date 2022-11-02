const helpers = require('./helpers');

exports.create = async (req, res) => {
  const { body } = req;

  try {
    await helpers.create(body, res, 'author');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readAll = async (_, res) => {
  try {
    await helpers.readAll(res, 'author');
  } catch (err) {
    throw new Error(err);
  }
};

exports.readById = async (req, res) => {
  const { authorId } = req.params;

  try {
    await helpers.readById(authorId, res, 'author');
  } catch (err) {
    throw new Error(err);
  }
};

exports.update = async (req, res) => {
  const {
    body,
    params: { authorId },
  } = req;

  try {
    await helpers.update(body, authorId, res, 'author');
  } catch (err) {
    throw new Error(err);
  }
};

exports.delete = async (req, res) => {
  const { authorId } = req.params;

  try {
    await helpers.delete(authorId, res, 'author');
  } catch (err) {
    throw new Error(err);
  }
};
