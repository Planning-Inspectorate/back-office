import {
	additionalCommentsURL,
	examiningInspectorsURL,
	hrefText,
	memLastUpdatedURL,
	newMaturityURL
} from './fees-forecasting.config.js';
import { format } from 'date-fns';
import { buildSummaryList } from '../../../lib/summary-list-mapper.js';

/**
 * @param {object|*} params
 * @returns {Promise<{ selectedPageType: string, internalUseSection: Array<Object>, accordionSections: Array<Object> }>}
 */
export const getFeesForecastingViewModel = async ({ caseData }) => {
	const internalUseSectionItems = [
		{
			key: 'New maturity',
			value: caseData.additionalDetails.newMaturity,
			actions: [{ href: newMaturityURL, text: hrefText, visuallyHiddenText: 'new maturity' }]
		},
		{
			key: 'Examining inspectors',
			html: [
				caseData.additionalDetails.numberBand2Inspectors
					? `${caseData.additionalDetails.numberBand2Inspectors} band 2 inspectors`
					: '',
				caseData.additionalDetails.numberBand3Inspectors
					? `${caseData.additionalDetails.numberBand3Inspectors} band 3 inspectors`
					: ''
			]
				.filter(Boolean)
				.join('<br/>'),
			actions: [
				{ href: examiningInspectorsURL, text: hrefText, visuallyHiddenText: 'examining inspectors' }
			]
		},
		{
			key: 'MEM last updated',
			value: caseData.keyDates.preApplication.memLastUpdated
				? format(new Date(caseData.keyDates.preApplication.memLastUpdated * 1000), 'dd MMM yyyy')
				: '',
			actions: [{ href: memLastUpdatedURL, text: hrefText, visuallyHiddenText: 'MEM last updated' }]
		},
		{
			key: 'Additional comments (optional)',
			value: caseData.additionalDetails.additionalComments,
			actions: [
				{ href: additionalCommentsURL, text: hrefText, visuallyHiddenText: 'additional comments' }
			]
		}
	];

	const accordionSections = [
		{
			heading: 'Pre-application overview',
			content: '',
			component: 'summary-list'
		},
		{
			heading: 'Fees',
			content: '',
			component: 'table'
		},
		{
			heading: 'Pre-application project meetings',
			content: '',
			component: 'table'
		},
		{
			heading: 'Pre-application evidence plan meetings',
			content: '',
			component: 'table'
		},
		{
			heading: 'Pre-application supplementary components',
			content: '',
			component: 'summary-list'
		},
		{
			heading: 'Pre-application programme document',
			content: '',
			component: 'summary-list'
		}
	];

	return {
		selectedPageType: 'fees-forecasting',
		internalUseSection: buildSummaryList(internalUseSectionItems),
		accordionSections: accordionSections
	};
};
