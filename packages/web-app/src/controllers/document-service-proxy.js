const { getDocument } = require('../lib/documents-api-wrapper');
const logger = require('../lib/logger');

exports.getDocument = async (req, res) => {
  const { appealId, documentId } = req.params;

  if (!appealId || !documentId) {
    logger.error('Request was missing either an appealId, or a documentId');
    return res.sendStatus(400);
  }

  let fileResponse;
  try {
    fileResponse = await getDocument(appealId, documentId);
  } catch (e) {
    logger.error({ e }, 'Document service proxy lookup failed.');
    return res.sendStatus(400);
  }

  try {
    const fileName = fileResponse.headers.get('x-original-file-name');

    res.set({
      'content-length': fileResponse.headers.get('content-length'),
      'content-disposition': `attachment;filename="${fileName}"`,
      'content-type': fileResponse.headers.get('content-type'),
    });
  } catch (e) {
    logger.error({ e }, 'Document was retrieved but appears to be missing key data.');
    return res.sendStatus(500);
  }

  return fileResponse.body.pipe(res);
};
