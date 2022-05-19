import config from '@pins/web/environment/config.js';
import differenceInDays from 'date-fns/differenceInDays/index.js';
import fs from 'node:fs/promises';

/**
 * Remove any files from .tmp that are older than a day old.
 *
 * @returns {Promise<void>}
 */
export default async function () {
	const filenames = await fs.readdir(config.tmpDir);

	await Promise.all([
		filenames.map(async (filename) => {
			const pathToFile = `${config.tmpDir}/${filename}`;
			const { birthtime } = await fs.stat(pathToFile);
			const daysSinceBirth = differenceInDays(new Date(), new Date(birthtime));

			if (daysSinceBirth > 0) {
				await fs.unlink(pathToFile);
			}
		})
	]);
}
