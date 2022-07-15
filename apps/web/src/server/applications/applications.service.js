import { get } from '../lib/request.js';

/** @typedef {import('./applications.types').Application} Application */
/** @typedef {import('./applications.types').DomainType} DomainType */

/**
 * @param {number} id
 * @returns {Promise<Application>}
 */
export const findApplicationById = (id) => {
	return get(`applications/application/${id}`);
};

/**
 * @param {DomainType} domainType
 * @returns {Promise<import('./applications.types').Application[]>}
 */
export const findOpenApplicationsByDomainType = (domainType) => {
	let rnd = 0;

	return get(`applications/${domainType}`).then((results) => {
		// @ts-ignore
		return results.map((a) => {
			const statusesList = [
				'Pre-application',
				'Acceptance',
				'Pre-examination',
				'Examination',
				'Recommendation',
				'Decision',
				'Post decision',
				'Withdrawn'
			];

			rnd = rnd > 6 ? 0 : rnd + 1;
			return { ...a, status: statusesList[rnd] };
		});
	});

	// return get(`applications/${domainType}`)
};
