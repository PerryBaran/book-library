module.exports = (connection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Must provide a name',
        },
        notEmpty: {
          args: true,
          msg: 'The name cannot be empty',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This email is already in use',
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Must provide an email',
        },
        isEmail: {
          args: true,
          msg: 'Email must be valid',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Must provide a password',
        },
        len: {
          args: [8],
          msg: 'Password must be atleast 8 characters',
        },
      },
    },
  };

  const scope = {
    defaultScope: {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    },
  };

  return connection.define('Reader', schema, scope);
};
