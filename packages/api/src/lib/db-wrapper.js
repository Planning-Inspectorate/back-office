const { Sequelize } = require('sequelize');
const config = require('../../database/config/config');
const ApiError = require('./api-error');

const sequelize = () => {
  const {
    development: { username, password, database, host, dialect },
  } = config;

  try {
    return new Sequelize(database, username, password, {
      host,
      dialect,
      define: {
        freezeTableName: true,
        timestamps: false,
        hasTrigger: true,
      },
    });
  } catch (err) {
    throw new ApiError(`Failed to connect to the database with error - ${err.toString()}`);
  }
};

const insert = (model, data) => {
  try {
    return model.create(data);
  } catch (err) {
    throw new ApiError(`Failed to insert data with error - ${err.toString()}`);
  }
};

const find = (model) => {
  try {
    return model.findAll();
  } catch (err) {
    throw new ApiError(`Failed to find data with error - ${err.toString()}`);
  }
};

module.exports = {
  sequelize,
  insert,
  find,
};
