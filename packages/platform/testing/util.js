import RandExp from 'randexp';
import { sample } from 'lodash-es';

export const createPostcode = () => {
	const randExp = new RandExp(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/);

	return randExp.gen();
};

export const randomBoolean = () => {
	return /** @type {boolean} */ (sample([true, false]));
};

export const randomLetter = () => {
	return String.fromCharCode(65 + Math.floor(Math.random() * 26));
};

export const createUniqueId = (() => {
	let id = 0;

	return () => {
		id += 1;
		return id;
	};
})();

/**
 * @param {number | string} value
 * @returns {string}
 */
export const pad = (value) => {
	const str = String(value);

	return str.length >= 2 ? str : new Array(2 - str.length + 1).join('0') + str;
};
