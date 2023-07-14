import { createOptionsItem } from '../factory/options-item.js';

export const fixtureRegions = [
	createOptionsItem({ name: 'london' }),
	createOptionsItem({ name: 'yorkshire' }),
	createOptionsItem({ name: 'east' }),
	createOptionsItem({ name: 'north' }),
	createOptionsItem({ name: 'south' }),
	createOptionsItem({ name: 'west' })
];

export const fixtureSectors = [
	createOptionsItem({ name: 'transport' }),
	createOptionsItem({ name: 'water' }),
	createOptionsItem({ name: 'waste' }),
	createOptionsItem({ name: 'energy' }),
	createOptionsItem({ name: 'waste_water' })
];

export const fixtureSubSectors = [
	createOptionsItem({ name: 'highways' }),
	createOptionsItem({ name: 'airports' }),
	createOptionsItem({ name: 'railways' })
];

export const fixtureZoomLevels = [
	createOptionsItem({ name: 'city' }),
	createOptionsItem({ name: 'county' }),
	createOptionsItem({ name: 'junction' }),
	createOptionsItem({ name: 'country' }),
	createOptionsItem({ name: 'region' }),
	createOptionsItem({ name: 'none' })
];

// this mocks the return from getting teop level folders
export const fixtureDocumentationTopLevelFolders = [
	{
		id: 1,
		displayNameEn: 'Project management',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 123
	},
	{ id: 2, displayNameEn: 'Legal advice', displayOrder: 200, parentFolderId: null, caseId: 123 },
	{ id: 3, displayNameEn: 'Transboundary', displayOrder: 300, parentFolderId: null, caseId: 123 },
	{ id: 4, displayNameEn: 'Land rights', displayOrder: 400, parentFolderId: null, caseId: 123 }
];

export const fixtureDocumentationSubFolders = [
	{ id: 31, displayNameEn: 'Sub folder a', displayOrder: 100, parentFolderId: 21, caseId: 123 },
	{ id: 32, displayNameEn: 'Sub folder b', displayOrder: 200, parentFolderId: 21, caseId: 123 }
];

export const fixtureDocumentationSingleFolder = {
	id: 21,
	displayNameEn: 'Sub folder level 2',
	displayOrder: 100,
	parentFolderId: 1,
	caseId: 123
};

export const fixtureS51Folder = {
	id: 21,
	displayNameEn: 'S51 advice folder',
	displayOrder: 100,
	parentFolderId: 1,
	caseId: 123
};

// this mocks the return from getting parent path on folder id 21
export const fixtureDocumentationFolderPath = [
	{ id: 1, displayNameEn: 'Project management', parentFolderId: null, caseId: 123 },
	{ id: 21, displayNameEn: 'Sub folder level 2', parentFolderId: 1, caseId: 123 }
];
