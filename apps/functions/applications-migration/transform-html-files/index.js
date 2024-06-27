import { transformMigratedHtmlFiles } from './transform-migrated-html-files.js';

/**
 * @typedef {Object} ApplicationInfo
 * @property {number} applicationId
 * @property {string} applicationRef
 */

/**
 * @param {import('@azure/functions').Context} context
 * @param {object} req
 * @param {object} req.body
 * @param {ApplicationInfo} req.body.applicationInfo
 */
export default async (context, { body: { applicationInfo } }) => {
	try {
		await transformMigratedHtmlFiles(context.log, applicationInfo);
		context.res = {
			status: 200,
			body: { message: `Successfully transformed html files for applications ${applicationInfo}` }
		};
	} catch (error) {
		context.log.error(`Failed to transform HTML files: ${error}`);
		context.res = {
			status: 500,
			body: {
				message: `Failed to transform HTML files. Error: ${error}`
			}
		};
	}
};
