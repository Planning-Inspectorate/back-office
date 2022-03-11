import { DataTypes } from 'sequelize';
import { databaseConnector } from '../database-connector.js';

const Appeal = databaseConnector.define('Appeal', {
	reference: {
		type: DataTypes.STRING,
		allowNull: false
	}
});

export default Appeal;
