module.exports = (sequelize, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'The author must be unique',
      },
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Must provide an author',
        },
        notEmpty: {
          args: true,
          msg: 'The author cannot be empty',
        },
      },
    },
  };

  const scope = {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
  };

  return sequelize.define('Author', schema, scope);
};
