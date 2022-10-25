const { Book, Reader, Author, Genre } = require('../models');

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    author: Author,
    genre: Genre
  };

  return models[model];
};

const getOptions = (model) => {
  switch(model) {
    case 'book': return { 
      include: [
        { model: Genre },
        { model: Author }
    ]};
    case 'author': return { 
      include: [{
        model: Book,
        include: [{
          model: Genre
        }]
      }] 
    };
    case 'genre': return { 
      include: [{
        model: Book,
        include: [{
          model: Author
        }]
      }]
    };
    default: return {};
  };
};

exports.create = async (data, res, model) => {
  const Model = getModel(model);

  try {
    const response = await Model.create(data);
    delete response.dataValues.password;

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.errors.map(e => e.message) });
  };
};

exports.readAll = async (res, model) => {
  const Model = getModel(model);
  const options = getOptions(model);

  try {
    const response = await Model.findAll(options);

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.errors.map(e => e.message) });
  };
};

exports.readById = async (id, res, model) => {
  const Model = getModel(model);
  const options = getOptions(model);

  try {
    const response = await Model.findByPk(id, options);

    if (!response) {
      res.status(404).json({ error: `The ${model} could not be found.` });
    } else {
      res.status(200).json(response);
    };
  } catch (err) {
    res.status(500).json({ error: err.errors.map(e => e.message) });
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
    res.status(500).json({ error: err.errors.map(e => e.message) });
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
    res.status(500).json({ error: err.errors.map(e => e.message) });
  };
};