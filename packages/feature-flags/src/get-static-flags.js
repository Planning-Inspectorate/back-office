import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import pino from '@pins/applications.web/src/server/lib/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default () => {
	try {
		const filePath = path.join(__dirname, 'static-feature-flags.json');
		const data = fs.readFileSync(filePath, 'utf8');
		const staticFlags = JSON.parse(data);
		pino.debug(`loading static flags ${staticFlags}`);

		return staticFlags;
	} catch (error) {
		pino.debug(`Error reading file: ${error}, returning empty object`);

		return {};
	}
};
