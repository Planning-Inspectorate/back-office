/**
 * @file Helper that uses Terser to minify on-disk JS.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { minify } from 'terser';

/**
 * Minify the passed on-disk script files. Assumes they have an adjacent ".map" source map.
 *
 * @param {string[]} generated paths to generated script files
 * @param {string} directory path to files
 * @returns {Promise<number>} ratio of compressed output to original source
 */
async function minifySource(generated, directory) {
	let inputSize = 0;
	let outputSize = 0;

	for (const fileName of generated) {
		const target = path.join(directory, fileName);
		const raw = await fs.readFile(target, 'utf8');

		inputSize += raw.length;

		try {
			const result = await minify(raw, {
				sourceMap: {
					content: await fs.readFile(`${target}.map`, 'utf8'),
					url: `${fileName}.map`
				}
			});

			if (result.code) {
				outputSize += result.code.length;
				await fs.writeFile(target, result.code, 'utf8');
			}
			if (typeof result.map === 'string') {
				await fs.writeFile(`${target}.map`, result.map, 'utf8');
			}
		} catch (error) {
			throw new Error(`could not minify ${fileName}: ${error}`);
		}
	}

	return outputSize / inputSize;
}

export { minifySource };
