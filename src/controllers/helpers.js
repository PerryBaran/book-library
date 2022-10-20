const Sequelize = require('sequelize');
const { Book, Reader } = require('../models');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader
  }

  return models[model];
}

exports.create = async (data, res, model) => {
  const Model = getModel(model);

  try {
    const response = await Model.create(data);
    return res.status(201).json(response);
  } catch (err) {
    return res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.readAll = async (res, model) => {
  const Model = getModel(model);

  try {
    const reponse = await Model.findAll();
    res.status(200).json(reponse);
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.readById = async (id, res, model) => {
  const Model = getModel(model);

  try {
    const response = await Model.findByPk(id);

    if (!response) {
      res.status(404).json({ error: `The ${model} could not be found.` });
    } else {
      res.status(200).json(response);
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.update = async (data, id, res, model) => {
  const Model = getModel(model);

  try {
    const [ updatedRows ] = await Model.update(data, { where: { id } });

    if (!updatedRows) {
      res.status(404).json({ error: `The ${model} could not be found.` })
    } else {
      res.status(200).send();
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  };
};

exports.delete = async (id, res, model) => {
  const Model = getModel(model);

  try {
    const deletedRows = await Model.destroy({where: { id } });
    if (!deletedRows) {
      res.status(404).json({ error: `The ${model} could not be found.` })
    } else {
      res.status(204).send();
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map((e) => e.message) });
  }
}