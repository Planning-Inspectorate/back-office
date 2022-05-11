import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() })
export const validateDocumentUpload = upload.single('file')
