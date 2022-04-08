import multer from 'multer';
import path from 'path';
import url from 'url';

const TMP_DIR = path.join(url.fileURLToPath(new URL('.', import.meta.url)), '../../../.tmp');

export const diskStorage = multer.diskStorage({ destination: TMP_DIR });
export const memoryStorage = multer.memoryStorage();
