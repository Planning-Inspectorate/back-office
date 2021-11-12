const Sequelize = require('sequelize');
const config = require('../../database/config/config');

const {
  development: { username, password, database, host, dialect },
} = config;

const dbConnect = new Sequelize(database, username, password, { host, dialect });

module.exports = dbConnect;
