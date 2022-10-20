module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Must provide a book title',
        },
        notEmpty: {
          args: [true],
          msg: 'The book title cannot be empty',
        },
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: [true],
          msg: 'Must provide an author',
        },
        notEmpty: {
          args: [true],
          msg: 'The author cannot be empty',
        },
      }
    },
    genre: {
      type: DataTypes.STRING,
    },
    ISBN: {
      type: DataTypes.STRING,
    },
  };

  return connection.define('Book', schema);
};