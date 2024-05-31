import { buildCaseInformation } from '../build-case-information.js';
import { featureFlagClient } from '../../../../common/feature-flags.js';

const fullParams = {
	case: {
		id: 1,
		reference: 'TEST_REFERENCE',
		status: 'Pre-acceptance',
		title: 'Test case title',
		titleWelsh: 'Test Welsh case title',
		description: 'Test case description',
		descriptionWelsh: 'Test Welsh case description',
		geographicalInformation: {
			locationDescription: 'Test location description',
			locationDescriptionWelsh: 'Test Welsh location description',
			mapZoomLevel: {
				displayNameEn: 'Test zoom level'
			}
		},
		caseEmail: 'Test case email',
		sector: {
			displayNameEn: 'Test sector'
		},
		subSector: {
			displayNameEn: 'Test subsector'
		}
	},
	gridReferences: 'Test grid reference',
	regionNames: ['Test region 1'],
	keyMembers: {
		caseManager: 'Test case manager',
		nsipOfficers: ['NSIP Officer 1', 'NSIP Officer 2']
	},
	publishedTag: '<strong>Test</strong>'
};

const fullResult = [
	{ title: 'Reference number', text: 'TEST_REFERENCE' },
	{ title: 'Case manager', text: 'Test case manager' },
	{ title: 'NSIP officers', text: 'NSIP Officer 1, NSIP Officer 2' },
	{ title: 'Sector', text: 'Test sector' },
	{ title: 'Subsector', text: 'Test subsector' },
	{
		title: featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? 'Regions'
			: 'Region(s)',
		html: ['Test region 1'],
		url: 'regions',
		classes: 'project-details__regions'
	},
	{
		title: 'Case stage',
		text: 'Pre-acceptance',
		url: 'stage'
	},
	{
		title: 'Project page',
		html: '<strong>Test</strong>'
	},
	{ title: 'Project name', text: 'Test case title', url: 'name', classes: 'project-details__name' },
	{
		title: 'Project name in Welsh',
		url: 'name-welsh',
		id: 'titleWelsh',
		classes: 'project-details__name',
		html: 'Test Welsh case title'
	},
	{
		title: 'Project description',
		html: 'Test case description',
		url: 'description',
		classes: 'project-details__project-description'
	},
	{
		title: 'Project description in Welsh',
		url: 'description-welsh',
		id: 'descriptionWelsh',
		html: 'Test Welsh case description'
	},
	{
		title: 'Project location',
		html: 'Test location description',
		url: 'project-location',
		classes: 'project-details__project-location'
	},
	{
		title: 'Project location in Welsh',
		url: 'project-location-welsh',
		id: 'geographicalInformation.locationDescriptionWelsh',
		html: 'Test Welsh location description'
	},
	{
		title: 'Project email address',
		text: 'Test case email',
		url: 'team-email',
		classes: 'project-details__team-email'
	},
	{
		title: 'Grid references',
		html: 'Test grid reference',
		url: 'grid-references',
		classes: 'project-details__grid-references'
	},
	{
		title: 'Map zoom level',
		text: 'Test zoom level',
		url: 'zoom-level',
		classes: 'project-details__zoom-level'
	}
];

describe('buildCaseInformation Nunjucks global', () => {
	it('Should return full expected result for full set of params when isWelsh is true', () => {
		expect(buildCaseInformation(fullParams, true)).toStrictEqual(fullResult);
	});

	it('Should return only non-Welsh results when isWelsh is false', () => {
		expect(buildCaseInformation(fullParams, false)).toStrictEqual(
			fullResult.filter((row) => !row.url?.includes('welsh'))
		);
	});
});
