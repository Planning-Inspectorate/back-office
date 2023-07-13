import { fake } from '@pins/platform';
import add from 'date-fns/add/index.js';
import { random } from 'lodash-es';

/** @typedef {import('@pins/appeals.api').Schema.SiteVisit} SiteVisit */

/**
 * @param {Partial<SiteVisit>} [options={}]
 * @returns {SiteVisit}
 */

export const createSiteVisit = ({
	id = fake.createUniqueId(),
	appealId = fake.createUniqueId(),
	visitDate = add(new Date(), { days: random(1, 7) }),
	visitEndTime = '16:00',
	visitStartTime = '14:00',
	siteVisitTypeId = 1
} = {}) => {
	return {
		id,
		appealId,
		visitDate,
		visitEndTime,
		visitStartTime,
		siteVisitTypeId
	};
};
