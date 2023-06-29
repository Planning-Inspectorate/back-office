import config from '@pins/applications.web/environment/config.js';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

export const diskStorage = multer.diskStorage({
	destination: config.tmpDir,
	filename(_, file, done) {
		const basename = crypto.randomBytes(16).toString('hex');

		done(null, basename + path.extname(file.originalname));
	}
});
export const memoryStorage = multer.memoryStorage();
