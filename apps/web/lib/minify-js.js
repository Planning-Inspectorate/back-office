/* eslint-disable no-await-in-loop */
/**
 * @fileoverview Helper that uses Terser to minify on-disk JS.
 */

'use strict';

const path = require('node:path');
const fs = require('node:fs').promises;
const terser = require('terser');

/**
 * Minify the passed on-disk script files. Assumes they have an adjacent ".map" source map.
 *
 * @param {!Array<string>} generated paths to generated script files
 * @returns {Promise<number>} ratio of compressed output to original source
 */
async function minifySource(generated, directory) {
	let inputSize = 0;
	let outputSize = 0;

	for (const fileName of generated) {
		const target = path.join(directory, fileName);

		const raw = await fs.readFile(target, 'utf8');
		inputSize += raw.length;

		let result;

		try {
			result = await terser.minify(raw, {
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

	const ratio = outputSize / inputSize;
	return ratio;
}

module.exports = {
	minifySource
};
