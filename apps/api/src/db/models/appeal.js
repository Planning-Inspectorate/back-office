import { Model, DataTypes } from 'sequelize';
import { dbConnector } from '../db-connector.js';

const Appeal = dbConnector.define('Appeal', {
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Appeal;