const config = {
  development: {
    username: process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
    host: process.env.MSSQL_HOST,
    dialect: process.env.MSSQL_DIALECT || 'mssql',
  },
};

module.exports = config;
