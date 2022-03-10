import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const sequelize = new Sequelize(
    config.SQL_SERVER_DATABASE,
    config.SQL_SERVER_USERNAME,
    config.SQL_SERVER_PASSWORD,
    {
        host: config.SQL_SERVER_HOST,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                useUTC: false,
                dateFirst: 1
            }
        }
    }
);

export {
    sequelize as dbConnector
}