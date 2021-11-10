const fetch = require('node-fetch');
const config = require('../config/config');
const logger = require('./logger');
const documentTypes = require('../../../common/src/document-types');

const {
  backOfficeApi: { v1Url: backOfficeUrl },
} = config;
const appealDataUrl = `${backOfficeUrl}/appeal`;
const questionnaireDataUrl = `${backOfficeUrl}/questionnaire`;

const formatDocumentsAndAddToData = (data) => {
  let newData = data;
  const documents = {};

  if (data.documents) {
    data.documents.forEach(({ name, id, document_type: documentType }) => {
      if (documentTypes[documentType]) {
        if (!documentTypes[documentType].multiple) {
          documents[documentType] = { name, id };
        } else {
          if (!documents[documentType]) {
            documents[documentType] = [];
          }
          documents[documentType].push({ name, id });
        }
      }
    });
  }

  newData = { ...newData, ...documents };
  delete newData.documents;

  return newData;
};

const getAppealData = async (appealId) => {
  try {
    const data = {
      appeal: {},
      casework: {},
      questionnaire: {},
    };

    logger.debug({ appealId }, 'appealId');

    if (appealId) {
      const appealApiResponse = await fetch(`${appealDataUrl}/${appealId}`);

      if (appealApiResponse.ok) {
        const appeal = await appealApiResponse.json();
        data.appeal = formatDocumentsAndAddToData(appeal);
      }

      const questionnaireApiResponse = await fetch(`${questionnaireDataUrl}/${appealId}`);

      if (questionnaireApiResponse.ok) {
        const questionnaire = await questionnaireApiResponse.json();
        data.questionnaire = formatDocumentsAndAddToData(questionnaire);
      }
    }

    return data;
  } catch (err) {
    throw new Error(`Failed to get data with error - ${err.toString()}`);
  }
};

const getAllAppeals = async () => {
  try {
    const appealApiResponse = await fetch(appealDataUrl);

    if (appealApiResponse.ok) {
      return appealApiResponse.json();
    }

    return [];
  } catch (err) {
    throw new Error(`Failed to get all appeals with error - ${err.toString()}`);
  }
};

const getAllQuestionnaires = async () => {
  try {
    const questionnaireApiResponse = await fetch(questionnaireDataUrl);

    if (questionnaireApiResponse.ok) {
      return questionnaireApiResponse.json();
    }

    logger.debug('No questionnaire data found');

    return [];
  } catch (err) {
    throw new Error(`Failed to get all questionnaires with error - ${err.toString()}`);
  }
};

const saveData = async (data) => {
  try {
    const response = await fetch(appealDataUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    return response.ok === true;
  } catch (err) {
    throw new Error(`Failed to save data with error - ${err.toString()}`);
  }
};

module.exports = {
  getAppealData,
  getAllAppeals,
  getAllQuestionnaires,
  saveData,
};
