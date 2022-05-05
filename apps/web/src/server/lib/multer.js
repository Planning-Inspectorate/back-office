import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import url from 'node:url';

const TMP_DIR = path.join(url.fileURLToPath(new URL('.', import.meta.url)), '../../../.tmp');

export const diskStorage = multer.diskStorage({
	destination: TMP_DIR,
	filename(_, file, done) {
		const basename = crypto.randomBytes(16).toString('hex');

		// eslint-disable-next-line unicorn/no-null
		done(null, basename + path.extname(file.originalname));
	}
});
export const memoryStorage = multer.memoryStorage();
