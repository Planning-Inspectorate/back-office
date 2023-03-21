import { fake } from '@pins/platform';
import { random } from 'lodash-es';
import pino from '../../../src/server/lib/logger.js';

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
	const date = new Date('2000-01-01');

	date.setDate(date.getDate() + seed);

	const randomFloat =
		Number.parseInt([...date.getTime().toString()].reverse().slice(-4).join(''), 10) / 10_000;

	if ((seed === 87 || seed === 109 || seed === 190 || seed === 131) && max === 8) {
		pino.info(`seed: ${seed}, ${date.getTime().toString()}`);
		pino.info(
			`seed: ${seed}, ${randomFloat}, ${randomFloat * max}, ${Math.floor(randomFloat * max)}`
		);
	}

	return Math.floor(randomFloat * max) + min;
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
