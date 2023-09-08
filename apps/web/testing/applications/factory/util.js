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
 *
 * @param {number} min
 * @param {number} max
 * @param {number} seed
 * @returns {number}
 */
export const createUniqueRandomNumberFromSeed = (min, max, seed) => {
	const date = new Date(Date.UTC(2000, 0, 0, 0, 0, 0));

	date.setDate(date.getDate() + (1 + seed) * (1 + seed) * (1 + seed));

	const randomFloat =
		Number.parseInt([...date.getTime().toString()].reverse().slice(-3).join(''), 10) / 1000;

	return Math.floor(randomFloat * (max - min)) + min;
};

/**
 *
 * @param {number} seed
 * @returns {boolean}
 */
export const createUniqueRandomBooleanFromSeed = (seed) => {
	const randomNumber = createUniqueRandomNumberFromSeed(0, 100_000, seed);

	return randomNumber % 2 === 0;
};
/**
 *
 * @param {number} seed
 * @param {number} minYear
 * @param {number} maxYear
 * @returns {number}
 */
export const createUniqueRandomDateFromSeed = (seed, minYear, maxYear) => {
	const randomYear = createUniqueRandomNumberFromSeed(minYear, maxYear, seed);
	const randomMonth = createUniqueRandomNumberFromSeed(1, 11, seed);
	const randomDay = createUniqueRandomNumberFromSeed(1, 27, seed);

	return new Date(`${randomYear}-${randomMonth}-${randomDay}`).getTime() / 1000;
};

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
