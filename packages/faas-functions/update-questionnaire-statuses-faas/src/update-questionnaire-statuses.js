const sql = require('mssql');
const config = require('./config');

module.exports = async (context) => {
  try {
    const sqlConfig = {
      user: config.sqlServer.username,
      password: config.sqlServer.password,
      database: config.sqlServer.database,
      server: config.sqlServer.server,
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
      },
    };

    const pool = await sql.connect(sqlConfig);
    const req = new sql.Request(pool);

    await req.query(
      // eslint-disable-next-line no-multi-str
      'UPDATE [AppealLink] SET QuestionnaireStatusID = 3 FROM AppealLink INNER JOIN HASAppeal ON \
      HASAppeal.AppealID = AppealLink.AppealID WHERE AppealLink.LatestEvent = 1 AND AppealLink.QuestionnaireStatusID = 1 \
      AND HASAppeal.LatestEvent = 1 AND HASAppeal.QuestionnaireDueDate < GETDATE()'
    );

    context.httpStatus = 200;

    return {
      id: 0,
    };
  } catch (err) {
    context.httpStatus = 500;

    return {
      error: err.message ?? 'Update statuses has failed',
    };
  }
};
