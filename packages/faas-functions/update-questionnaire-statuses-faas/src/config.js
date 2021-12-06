module.exports = {
  sqlServer: {
    username: process.env.SQLSERVER_USERNAME,
    password: process.env.SQLSERVER_PASSWORD,
    database: process.env.SQLSERVER_DATABASE,
    server: process.env.SQLSERVER_NAME,
    port: process.env.SQLSERVER_PORT,
  },
  appealsService: {
    url: process.env.APPEALS_SERVICE_URL,
  },
  documentService: {
    url: process.env.DOCUMENT_SERVICE_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
  },
};
