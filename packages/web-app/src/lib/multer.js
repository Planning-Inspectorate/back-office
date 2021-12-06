const multer = require('multer');
const config = require('../config/config');

const {
  fileUpload: { maxSizeInBytes, path },
} = config;

const multerWrapper = multer({
  limits: {
    fileSize: maxSizeInBytes,
  },
  storage: multer.diskStorage({
    destination: path,
  }),
});

module.exports = multerWrapper;
