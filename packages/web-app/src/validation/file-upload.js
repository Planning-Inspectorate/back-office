const { checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');

const fileUpload = () => checkSchema(fileUploadSchema);

module.exports = fileUpload;
