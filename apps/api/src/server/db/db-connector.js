import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('pins_development', 'SA', '<YourStrong@Passw0rd>', {
    host: '0.0.0.0',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1
      }
    }
  });

  export {
      sequelize as dbConnector
  }