import { sanitize } from '../nunjucks-filters/sanitize.js';
import { featureFlagClient } from '../../../common/feature-flags.js';
import { getIsMaterialChangeStaticDataViewModel } from '../static-data-view-models.js';

const isMaterialChangeStaticDataViewModel = getIsMaterialChangeStaticDataViewModel();

/**
 * @typedef {Object} Row
 * @property {string} title
 * @property {string} [url]
 * @property {string | null} [text]
 * @property {string | null} [id]
 * @property {*} [html]
 * @property {string} [classes]
 * @property {number} [colspan]
 * */

/**
 * @typedef {Object} Case
 * @property {number} id
 * @property {string} reference
 * @property {boolean} isMaterialChange
 * @property {{ displayNameEn: string }} sector
 * @property {{ displayNameEn: string }} subSector
 * @property {string | null} title
 * @property {string | null} description
 * @property {string | null} titleWelsh
 * @property {string | null} descriptionWelsh
 * @property {{ locationDescription: string, locationDescriptionWelsh: string, mapZoomLevel: { displayNameEn: string } } | null} geographicalInformation
 * @property {string | null} caseEmail
 * @property {string} status
 * */

/**
 * @typedef {{ caseManager: string | null, nsipOfficers: string[] }} KeyTeamMembers
 * */

/**
 * @param {{ case: Case, keyMembers?: KeyTeamMembers, gridReferences: string, regionNames: string[], publishedTag: string }} params
 * @param {boolean} isWelsh
 * @returns {Row[]}
 * */
export const buildCaseInformation = (params, isWelsh) => [
	{
		title: 'Reference number',
		text: params.case.reference
	},
	{
		title: 'Is this an application for a material change?',
		text: params.case.isMaterialChange
			? isMaterialChangeStaticDataViewModel[0].text
			: isMaterialChangeStaticDataViewModel[1].text,
		url: 'material-change'
	},
	...(params.keyMembers?.caseManager
		? [
				{
					title: 'Case manager',
					text: params.keyMembers.caseManager
				}
		  ]
		: []),
	...((params.keyMembers?.nsipOfficers ?? []).length > 0
		? [
				{
					title: 'NSIP officers',
					text: params.keyMembers?.nsipOfficers.join(', ')
				}
		  ]
		: []),
	{
		title: 'Sector',
		text: params.case.sector.displayNameEn
	},
	{
		title: 'Subsector',
		text: params.case.subSector.displayNameEn
	},
	{
		title: featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? 'Regions'
			: 'Region(s)',
		html: params.regionNames.join(', '),
		url: 'regions',
		classes: 'project-details__regions'
	},
	{
		title: 'Case stage',
		text: params.case.status,
		url: 'stage'
	},
	{
		title: 'Project page',
		html: params.publishedTag,
		classes: 'project-details__project-page'
	},
	{
		title: 'Project name',
		text: params.case.title,
		url: 'name',
		classes: 'project-details__name'
	},
	...(isWelsh
		? [
				{
					title: 'Project name in Welsh',
					url: 'name-welsh',
					id: 'titleWelsh',
					classes: 'project-details__name',
					html: params.case.titleWelsh
				}
		  ]
		: []),
	{
		title: 'Project description',
		html: sanitize(params.case.description ?? ''),
		url: 'description',
		classes: 'project-details__project-description'
	},
	...(isWelsh
		? [
				{
					title: 'Project description in Welsh',
					url: 'description-welsh',
					id: 'descriptionWelsh',
					html: params.case.descriptionWelsh
				}
		  ]
		: []),
	{
		title: 'Project location',
		html: sanitize(params.case.geographicalInformation?.locationDescription ?? ''),
		url: 'project-location',
		classes: 'project-details__project-location'
	},
	...(isWelsh
		? [
				{
					title: 'Project location in Welsh',
					url: 'project-location-welsh',
					id: 'geographicalInformation.locationDescriptionWelsh',
					html: params.case.geographicalInformation?.locationDescriptionWelsh
				}
		  ]
		: []),
	{
		title: 'Project email address',
		text: params.case.caseEmail,
		url: 'team-email',
		classes: 'project-details__team-email'
	},
	{
		title: 'Grid references',
		html: params.gridReferences,
		url: 'grid-references',
		classes: 'project-details__grid-references'
	},
	{
		title: 'Map zoom level',
		text: params.case.geographicalInformation?.mapZoomLevel.displayNameEn,
		url: 'zoom-level',
		classes: 'project-details__zoom-level'
	}
];
