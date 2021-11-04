const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../database/config/config');

const basename = path.basename(__filename);
const db = {};

const {
  development: { username, password, database, host, dialect },
} = config;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  define: {
    freezeTableName: true,
    timestamps: false,
    hasTrigger: true,
  },
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      !file.includes('spec') &&
      file.slice(-3) === '.js'
  )
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  /* istanbul ignore next */
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
