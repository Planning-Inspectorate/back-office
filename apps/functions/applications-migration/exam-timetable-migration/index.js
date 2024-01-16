import { migrateExamTimetables } from './src/exam-timetable-migration.js';

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, { body: { caseReferences } }) {
	console.info('Migrating Exam Timetable for', JSON.stringify(caseReferences));

	await migrateExamTimetables(context.log, caseReferences);
}
