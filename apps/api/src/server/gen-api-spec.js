import swaggerAutogen from 'swagger-autogen';
import prettier from 'prettier';
import { spec } from './swagger.js';
import { generateApi } from 'swagger-typescript-api';
import path from 'path';
import url from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const endpointsFiles = [
	'./src/server/appeals/**/*.routes.js',
	'./src/server/applications/**/*.routes.js'
];

const specFile = path.join(__dirname, 'swagger-output.json');
const typesFile = path.join(__dirname, 'swagger-types.ts');

/**
 * Generate the API spec and types
 */
async function run() {
	console.log(`generating api spec`);
	const res = await swaggerAutogen({ disableLogs: true })(specFile, endpointsFiles, spec);
	if (!res) {
		throw new Error('no spec generated');
	}
	const specContent = res.data;

	console.log(`generating api types`);
	const { files } = await generateApi({
		name: path.basename(typesFile),
		input: specFile,
		output: path.dirname(specFile),
		generateClient: false
	});

	console.log(`formatting files`);
	await formatWrite(specFile, JSON.stringify(specContent, null, 2));

	for (const f of files) {
		const filePath = path.join(__dirname, f.fileName + f.fileExtension);
		await formatWrite(filePath, f.fileContent);
	}
	console.log(`done`);
}

/**
 * Format contents with prettier and write to file
 *
 * @param {string} filePath
 * @param {string} content
 */
async function formatWrite(filePath, content) {
	const options = await prettier.resolveConfig(filePath);
	if (options === null) {
		throw new Error(`no prettier config for ${filePath}`);
	}
	options.filepath = filePath;
	const formatted = prettier.format(content, options);
	await fs.writeFile(filePath, formatted);
}

run();
