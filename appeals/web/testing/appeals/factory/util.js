import { fake } from '@pins/platform';
import { random, sample } from 'lodash-es';
import { localPlanningDepartments } from '../../app/fixtures/referencedata.js';

/**
 * @typedef {object} AppealReferenceOptions
 * @property {string} [prefix='HAS']
 */

/**
 * @param {AppealReferenceOptions} [options={}]
 * @returns {string}
 */
export const createAppealReference = ({ prefix = 'HAS' } = {}) =>
	[
		prefix,
		`${fake.randomLetter()}${random(1000, 9999)}`,
		fake.randomLetter(),
		String(random(1, 99)).padStart(2, '0'),
		random(1_000_000, 9_999_999)
	].join('/');

export const createPlanningApplicationReference = () =>
	[random(1, 99), String(random(1, 99)).padStart(2, '0'), random(1000, 9999)].join('/');

export const getRandomLocalPlanningDepartment = () =>
	/** @type {string} */ (sample(localPlanningDepartments));
