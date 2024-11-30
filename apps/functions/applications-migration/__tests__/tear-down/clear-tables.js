import { getSequelizeInstance } from '../tools/sequelize-instance.js';

export const clearNonStaticDataTables = async () => {
	// ordering is important
	const tablesToClear = [
		'RepresentationAttachment',
		'RepresentationAction',
		'Representation',
		'S51AdviceDocument',
		'S51Advice',
		'DocumentActivityLog',
		'DocumentVersion',
		'Document',
		'RegionsOnApplicationDetails',
		'ExaminationTimetableItem',
		'ExaminationTimetable',
		'Subscription',
		'ProjectUpdateNotificationLog',
		'ProjectUpdate',
		'ServiceUser',
		'GridReference',
		'ProjectTeam',
		'ApplicationDetails',
		'CaseStatus',
		'CasePublishedState',
		'Folder',
		'Case'
	];
	const cbosDb = getSequelizeInstance();
	try {
		console.log('Initiating DB clean up...');
		await cbosDb.query(
			`
			EXEC sp_MSforeachtable @command1="ALTER TABLE ? NOCHECK CONSTRAINT ALL"
			${tablesToClear
				.map((table) => 'DELETE FROM [pins_development].[dbo].[' + table + '] WHERE 1=1;')
				.join('\n')}
			EXEC sp_MSforeachtable @command1="ALTER TABLE ? CHECK CONSTRAINT ALL"
			`
		);
	} catch (/** @type {any} */ error) {
		console.dir(error, { depth: null });
		throw Error(error);
	}
};
