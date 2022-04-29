import path from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * @param {string} assetName 
 * @returns {string}
 */
export function getPathToAsset(assetName) {
	return path.join(__dirname, assetName);
}
