require('dotenv').config();

const config = {
  backOfficeApi: {
    url: process.env.BACK_OFFICE_API_URL || 'http://localhost',
  },
  application: {
    defaultDateFormat: 'DD MMMM YYYY',
  },
  documents: {
    timeout: Number(process.env.DOCUMENTS_SERVICE_API_TIMEOUT || 10000),
    url: process.env.DOCUMENTS_SERVICE_API_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['opts.body'],
  },
  server: {
    port: process.env.PORT || 3000,
  },
  sso: {
    auth: {
      clientId: process.env.AUTH_CLIENT_ID,
      cloudInstanceId: process.env.AUTH_CLOUD_INSTANCE_ID,
      tenantId: process.env.AUTH_TENANT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    },
    redirectUri: process.env.AUTH_REDIRECT_URI,
  },
  services: {
    notify: {
      templates: {
        startEmailToLpa: process.env.SRV_NOTIFY_START_EMAIL_TO_LPA_TEMPLATE_ID,
      },
      emailReplyToId: {
        startEmailToLpa: process.env.SRV_NOTIFY_EMAIL_REPLYTO_ID_START_EMAIL_TO_LPA,
      },
    },
    osPlaces: {
      key: process.env.SRV_OS_PLACES_KEY,
      url: process.env.SRV_OS_PLACES_URL,
    },
  },
  apps: {
    lpaQuestionnaire: {
      baseUrl: process.env.APP_LPA_QUESTIONNAIRE_BASE_URL,
    },
  },
};

module.exports = config;
