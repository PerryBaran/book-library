const { ISBN_REGEX } = require('../../reusedVariables');

module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Must provide a book title',
        },
        notEmpty: {
          args: true,
          msg: 'The book title cannot be empty',
        },
      },
    },
    ISBN: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'ISBN must be unique',
      },
      validate: {
        is: {
          args: ISBN_REGEX,
          msg: 'ISBN must be of valid format',
        },
      },
    },
  };

  const scope = {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  };

  return connection.define('Book', schema, scope);
};
