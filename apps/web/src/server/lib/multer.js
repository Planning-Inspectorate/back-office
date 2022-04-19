import multer from 'multer';
import path from 'path';
import url from 'url';
import crypto from 'crypto';

const TMP_DIR = path.join(url.fileURLToPath(new URL('.', import.meta.url)), '../../../.tmp');

export const diskStorage = multer.diskStorage({
	destination: TMP_DIR,
	filename: function (_, file, done) {
		const basename = crypto.randomBytes(16).toString('hex');
		// eslint-disable-next-line unicorn/no-null
		done(null, basename + path.extname(file.originalname));
	}
});
export const memoryStorage = multer.memoryStorage();
