process.env.APP_LPA_QUESTIONNAIRE_BASE_URL = 'http://fake-lpa-questionnaire-base-url';

require('@testing-library/jest-dom');

const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();
