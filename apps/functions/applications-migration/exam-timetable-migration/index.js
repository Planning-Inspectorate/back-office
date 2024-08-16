import { migrateExamTimetablesForCase } from '../common/migrators/exam-timetable-migration.js';
import { handleMigrationWithResponse } from '../common/handle-migration-with-response.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async (context, { body: { caseReference } }) => {
	await handleMigrationWithResponse(
		context,
		caseReference,
		() => migrateExamTimetablesForCase(context.log, caseReference),
		'exam timetable'
	);
};
