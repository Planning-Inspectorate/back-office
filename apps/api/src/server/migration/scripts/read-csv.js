import fs from 'fs';
import { parse } from '@fast-csv/parse';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} name
 * @returns {Promise<Object[]>}
 */
export function readCsv(name) {
	let fp = name;
	if (!fp.includes('/')) {
		fp = path.join(__dirname, name);
	}
	return new Promise((resolve, reject) => {
		const rows = [];
		fs.createReadStream(fp)
			.pipe(parse({ headers: true }))
			.on('error', (error) => reject(error))
			.on('data', (row) => rows.push(row))
			.on('end', () => resolve(rows));
	});
}
