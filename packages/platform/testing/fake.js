import { sample } from 'lodash-es';
import RandExp from 'randexp';

const createPostcode = () => {
	const randExp = new RandExp(/^[A-Z]{1,2}\d[\dA-Z]? ?\d[A-Z]{2}$/);

	return randExp.gen();
};

const randomBoolean = () => {
	return /** @type {boolean} */ (sample([true, false]));
};

const randomLetter = () => {
	return String.fromCodePoint(65 + Math.floor(Math.random() * 26));
};

const createUniqueId = (() => {
	let id = 0;

	return () => {
		id += 1;
		return id;
	};
})();

export const fake = {
	createPostcode,
	createUniqueId,
	randomBoolean,
	randomLetter
};
