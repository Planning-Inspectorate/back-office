import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Copy the api schema to this project for use with prisma - to connect to the database directly
 */
async function run() {
	// apps/functions/migration/database -> apps/api/src/database/schema.prisma
	const schemaPath = path.join(__dirname, '../../../api/src/database/schema.prisma');
	const out = path.join(__dirname, 'schema.prisma');
	const content = await fs.readFile(schemaPath);
	const schema = content
		.toString()
		.replace(
			'provider = "prisma-client-js"',
			'provider = "prisma-client-js"\n  output   = "./db-client"'
		);
	await ensureDir(path.join(__dirname, 'db-client'));
	await fs.writeFile(out, schema);
}

/**
 * Ensure a directory exists, create it if not
 *
 * @param {string} dir
 * @returns {Promise<void>}
 */
async function ensureDir(dir) {
	try {
		await fs.mkdir(dir);
	} catch (/** @type {any} */ e) {
		if (e.code !== 'EEXIST') {
			throw e;
		}
	}
}

run();
