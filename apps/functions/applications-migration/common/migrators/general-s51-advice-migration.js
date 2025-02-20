import { migrateS51AdviceForCase } from './s51-advice-migration.js';
import { BO_GENERAL_S51_CASE_REF, ODW_GENERAL_S51_CASE_REF } from '@pins/applications';
import { migrateNsipDocumentsByReference } from './nsip-document-migration.js';
import { app } from '@azure/functions';
import { Readable } from 'stream';
import { handleEntityStream } from '../../migrate-case/index.js';

app.setup({ enableHttpStream: true });

/**
 * @param {import('@azure/functions').Logger} logger
 */
app.setup({ enableHttpStream: true });

export const migrateGeneralS51Advice = async (logger) => {
	logger.info('Migrating all General S51 Advice: ');
	const caseReferenceTaskList = [
		() => migrateNsipDocumentsByReference(logger, BO_GENERAL_S51_CASE_REF),
		() => migrateS51AdviceForCase(logger, ODW_GENERAL_S51_CASE_REF, true)
	];
	try {
		return Readable.from(
			(async function* () {
				for (const task of caseReferenceTaskList) {
					let isError = false;
					const entityStream = await task();

					for await (const chunk of handleEntityStream(entityStream)) {
						const chunkString = chunk.toString();
						if (chunkString?.toLowerCase()?.includes('error')) {
							logger.error(`Error detected in chunk: ${chunkString}`);
							isError = true;
						}
						yield chunk;
					}

					if (isError) break;
				}
			})()
		);
	} catch (error) {
		logger.error(`Error occurred during GeneralS51 Advice migration`, error);
		throw error;
	}
};
