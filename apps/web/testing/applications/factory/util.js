import { fake } from '@pins/platform';
import { random, sample } from 'lodash-es';
import { localPlanningDepartments } from '../../app/fixtures/referencedata.js';

/**
 * @typedef {object} ApplicationReferenceOptions
 * @property {string} [prefix='APP']
 */

/**
 * @param {ApplicationReferenceOptions} [options={}]
 * @returns {string}
 */
export const createApplicationReference = ({ prefix = 'APP' } = {}) =>
	[
		prefix,
		`${fake.randomLetter()}${random(1000, 9999)}`,
		fake.randomLetter(),
		String(random(1, 99)).padStart(2, '0'),
		random(1_000_000, 9_999_999)
	].join('/');

export const createRandomDescription = ({ wordsNumber = 40, startOffset = 0 }) => {
	const loremIpsumString =
		'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';
	const loremIpsumWords = loremIpsumString.split(' ');
	const result = loremIpsumWords.slice(startOffset, startOffset + wordsNumber).join(' ');

	return result.charAt(0).toUpperCase() + result.slice(1);
};

export const getRandomLocalPlanningDepartment = () =>
	/** @type {string} */ (sample(localPlanningDepartments));
