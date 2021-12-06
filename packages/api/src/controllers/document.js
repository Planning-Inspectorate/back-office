const { uploadDocument } = require('../lib/documents-api-wrapper');
const logger = require('../lib/logger');

const postDocument = async (req, res) => {
  try {
    const {
      files,
      params: { appealOrQuestionnaireId },
    } = req;

    const result = await uploadDocument(appealOrQuestionnaireId, files);

    res.status(200).send(result);
  } catch (err) {
    logger.error({ err }, 'Failed to upload document');

    res.status(500).send('Failed to upload document');
  }
};

module.exports = {
  postDocument,
};
