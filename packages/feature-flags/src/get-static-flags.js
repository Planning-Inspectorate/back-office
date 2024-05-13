import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef {Function} LoggerFn
 * @param {...string} args
 * @returns {void}
 * */

/**
 * @typedef {{ debug: LoggerFn, error: LoggerFn }} Logger
 * */

/**
 * @param {Logger} logger
 * */

export default (logger) => {
	try {
		const filePath = path.join(__dirname, 'static-feature-flags.json');
		const data = fs.readFileSync(filePath, 'utf8');
		const staticFlags = JSON.parse(data);
		logger.debug(`loading static flags ${staticFlags}`);

		return staticFlags;
	} catch (error) {
		logger.debug(`Error reading file: ${error}, returning empty object`);

		return {};
	}
};
