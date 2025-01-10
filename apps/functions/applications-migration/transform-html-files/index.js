import { transformMigratedHtmlFiles } from './transform-migrated-html-files.js';
import { app } from '@azure/functions';

app.http('transform-html-files', {
	methods: ['POST'],
	handler: async (request, context) => {
		const { applicationInfo } = await request.json();
		try {
			await transformMigratedHtmlFiles(context, applicationInfo);
			return {
				status: 200,
				jsonBody: {
					message: `Successfully transformed html files for applications ${applicationInfo}`
				}
			};
		} catch (error) {
			context.error(`Failed to transform HTML files: ${error}`);
			return {
				status: 500,
				jsonBody: {
					message: `Failed to transform HTML files. Error: ${error}`
				}
			};
		}
	}
});
