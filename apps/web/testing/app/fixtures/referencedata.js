import { sample } from 'lodash-es';

export const localPlanningDepartments = [
	'Maidstone Borough Council',
	'Barnsley Metropolitan Borough Council',
	'Worthing Borough Council',
	'Dorset Council',
	'Basingstoke and Deane Borough Council',
	'Wiltshire Council',
	'Waveney District Council',
	'Bristol City Council'
];

export const getRandomLocalPlanningDepartment = () =>
	/** @type {string} */ (sample(localPlanningDepartments));
