import path from 'node:path';
import url from 'node:url';

const dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * @typedef {'anthropods.pdf' | 'simple.pdf'} AssetName
 */

/**
 * @param {AssetName} assetName
 * @returns {string}
 */
export function getPathToAsset(assetName) {
	return path.join(dirname, assetName);
}
