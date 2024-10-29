import { getSequelizeInstance } from '../tools/sequelize-instance.js';

export const clearNonStaticDataTables = async () => {
	const tablesToClear = [
		'ApplicationDetails',
		// 'Case',
		'CasePublishedState',
		'CaseStatus',
		'Document',
		'DocumentActivityLog',
		'DocumentVersion',
		'ExaminationTimetable',
		'ExaminationTimetableItem',
		'GridReference',
		'ProjectTeam',
		'ProjectUpdate',
		'ProjectUpdateNotificationLog',
		'RegionsOnApplicationDetails',
		'Representation',
		'RepresentationAction',
		'RepresentationAttachment',
		'S51Advice',
		'S51AdviceDocument',
		// ServiceUser not included for now - doesn't have caseId property
		'Subscription'
	];
	const cbosDb = getSequelizeInstance();
	const result = await cbosDb.query(
		`
		EXEC sp_MSforeachtable @command1="ALTER TABLE ? NOCHECK CONSTRAINT ALL"
		${tablesToClear
			.map(
				(table) =>
					'DELETE FROM [pins_development].[dbo].[' +
					table +
					'] WHERE id != 100000000 AND caseId != 100000000;'
			)
			.join('\n')}
		EXEC sp_MSforeachtable @command1="ALTER TABLE ? CHECK CONSTRAINT ALL"
		`
	);
	// add additional query to clear Case table
	// await cbosDb.query();
	console.log(result);
};
