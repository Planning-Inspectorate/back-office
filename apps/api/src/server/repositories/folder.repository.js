import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.Folder[]>}
 */
export const getByCaseId = (caseId) => {
	return databaseConnector.folder.findMany({ where: { caseId } });
};

export const createFolders = () => {
	return databaseConnector.folder.create({
		data: [
			{
				displayNameEn: 'Project management',
				displayOrder: 100,
				type: 'folder'
			},
			{
				displayNameEn: 'Legal advice',
				displayOrder: 200,
				type: 'folder'
			},
			{
				displayNameEn: 'Transboundary',
				displayOrder: 300,
				type: 'folder'
			},
			{
				displayNameEn: 'Legal rights',
				displayOrder: 400,
				type: 'folder'
			},
			{
				displayNameEn: 'S51 advice',
				displayOrder: 500,
				type: 'folder'
			},
			{
				displayNameEn: 'Pre-application',
				displayOrder: 600,
				type: 'folder'
			},
			{
				displayNameEn: 'Acceptance',
				displayOrder: 700,
				type: 'folder'
			},
			{
				displayNameEn: 'Relevant representation',
				displayOrder: 800,
				type: 'folder'
			},
			{
				displayNameEn: 'Examination',
				displayOrder: 900,
				type: 'folder'
			},
			{
				displayNameEn: 'Decision',
				displayOrder: 1000,
				type: 'folder'
			},
			{
				displayNameEn: 'Post-decision',
				displayOrder: 1100,
				type: 'folder'
			}
		]
	});
};
