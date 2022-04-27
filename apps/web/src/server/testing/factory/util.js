import { randomLetter } from '@pins/platform/testing';
import { sample, random } from 'lodash-es';
import { localPlanningDepartments } from '../fixtures/referencedata';

export const createAppealReference = () =>
	[
		'APP',
		`${randomLetter()}${random(1000, 9999)}`,
		randomLetter(),
		String(random(1, 99)).padStart(2, '0'),
		random(1_000_000, 9_999_999)
	].join('/');

export const createPlanningApplicationReference = () =>
	[random(1, 99), String(random(1, 99)).padStart(2, '0'), random(1000, 9999)].join('/');

export const getRandomLocalPlanningDepartment = () =>
	/** @type {string} */ (sample(localPlanningDepartments));
