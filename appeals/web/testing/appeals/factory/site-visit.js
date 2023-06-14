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
	visitSlot = '1pm - 2pm',
	visitType = 'accompanied'
} = {}) => {
	return {
		id,
		appealId,
		visitDate,
		visitSlot,
		visitType
	};
};
