import { sanitize } from '../nunjucks-filters/sanitize.js';

/**
 * @typedef {Object} Row
 * @property {string} title
 * @property {string} url
 * @property {string | null} [text]
 * @property {*} [html]
 * @property {string} [classes]
 * */

/**
 * @typedef {Object} Case
 * @property {number} id
 * @property {string | null} title
 * @property {string | null} description
 * @property {string | null} titleWelsh
 * @property {string | null} descriptionWelsh
 * @property {{ locationDescription: string, locationDescriptionWelsh: string, mapZoomLevel: { displayNameEn: string } } | null} geographicalInformation
 * @property {string | null} caseEmail
 * */

/**
 * @param {{ case: Case, gridReferences: string, regionNames: string[] }} params
 * @param {boolean} isWelsh
 * @returns {Row[]}
 * */
export const buildCaseInformation = (params, isWelsh) => [
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
		title: 'Region(s)',
		html: params.regionNames,
		url: 'regions',
		classes: 'project-details__regions'
	},
	{
		title: 'Map zoom level',
		text: params.case.geographicalInformation?.mapZoomLevel.displayNameEn,
		url: 'zoom-level',
		classes: 'project-details__zoom-level'
	}
];