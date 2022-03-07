/**
 * @fileoverview Helper that uses Terser to minify on-disk JS.
 */

import path from 'path';
import * as fs from 'fs/promises';
import { minify } from 'terser';

/**
 * Minify the passed on-disk script files. Assumes they have an adjacent ".map" source map.
 *
 * @param {!Array<string>} generated paths to generated script files
 * @param {String} directory path to files
 * @returns {Promise<number>} ratio of compressed output to original source
 */
async function minifySource(generated, directory) {
	let inputSize = 0;
	let outputSize = 0;

	/* eslint-disable no-await-in-loop */
	for (const fileName of generated) {
		const target = path.join(directory, fileName);

		const raw = await fs.readFile(target, 'utf8');
		inputSize += raw.length;

		let result;

		try {
			result = await minify(raw, {
				sourceMap: {
					content: await fs.readFile(target + '.map', 'utf8'),
					url: fileName + '.map'
				}
			});
		} catch (error) {
			throw new Error(`could not minify ${fileName}: ${error}`);
		}

		outputSize += result.code.length;
		await fs.writeFile(target, result.code, 'utf8');
		await fs.writeFile(target + '.map', result.map, 'utf8');
	}
	/* eslint-enable no-await-in-loop */

	const ratio = outputSize / inputSize;
	return ratio;
}

export {
	minifySource
};
