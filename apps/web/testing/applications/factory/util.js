import { fake } from '@pins/platform';
import { random } from 'lodash-es';

/**
 * @param {{prefix: string}} [options={prefix: 'APP'}]
 * @returns {string}
 */
export const createCaseReference = ({ prefix = 'APP' }) =>
	[
		prefix,
		`${fake.randomLetter()}${random(1000, 9999)}`,
		fake.randomLetter(),
		String(random(1, 99)).padStart(2, '0'),
		random(1_000_000, 9_999_999)
	].join('/');

/**
 * @param {{wordsNumber: number, startOffset: number}} [options={}]
 * @returns {string}
 */
export const createRandomDescription = ({ wordsNumber = 40, startOffset = 0 }) => {
	const loremIpsumString =
		'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';
	const loremIpsumWords = loremIpsumString.split(' ');
	const result = loremIpsumWords.slice(startOffset, startOffset + wordsNumber).join(' ');

	return result.charAt(0).toUpperCase() + result.slice(1);
};
