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

export const appealsNationalList = [
	{
		appealId: 1,
		appealReference: 'APP/Q9999/D/21/943245',
		appealSite: {
			addressLine1: 'Copthalls',
			addressLine2: 'Clevedon Road',
			town: 'West Hill',
			postCode: 'BS48 1PN'
		},
		appealStatus: 'received_appeal',
		appealType: 'household',
		createdAt: '2023-04-17T09:49:22.021Z',
		localPlanningDepartment: 'Wiltshire Council'
	},
	{
		appealId: 2,
		appealReference: 'APP/Q9999/D/21/129285',
		appealSite: {
			addressLine1: '19 Beauchamp Road',
			town: 'Bristol',
			postCode: 'BS7 8LQ'
		},
		appealStatus: 'received_appeal',
		appealType: 'household',
		createdAt: '2023-04-17T09:49:22.057Z',
		localPlanningDepartment: 'Dorset Council'
	}
];

export const getRandomLocalPlanningDepartment = () =>
	/** @type {string} */ (sample(localPlanningDepartments));
