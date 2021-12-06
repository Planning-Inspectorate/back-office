const { validMimeType, validateMimeBinaryType } = require('pins-mime-validation');
const validateFileSize = require('../utils/validate-file-size');
const mimeTypes = require('../../config/mime-types');
const config = require('../../config/config');

const schema = {
  'file-upload': {
    custom: {
      options: async (value, { req }) => {
        const { files = [] } = req;
        const { maxSizeInBytes } = config.fileUpload;

        if (files.length === 0) {
          throw new Error('Select a document to add');
        }

        files.forEach(({ mimetype, originalname }) => {
          validMimeType(
            mimetype,
            mimeTypes,
            `${originalname} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
          );
        });

        files.forEach(({ size, originalname }) => {
          validateFileSize(size, maxSizeInBytes, originalname);
        });

        await Promise.all(
          files.map(({ path, originalname }) =>
            validateMimeBinaryType(
              { tempFilePath: path },
              mimeTypes,
              `${originalname} must be a DOC, DOCX, PDF, TIF, JPG or PNG`
            )
          )
        );

        return true;
      },
    },
  },
};

module.exports = schema;
