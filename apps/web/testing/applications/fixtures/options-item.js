import { createOptionsItem } from '../factory/options-item.js';

export const fixtureRegions = [
	createOptionsItem({ name: 'london' }),
	createOptionsItem({ name: 'yorkshire' }),
	createOptionsItem({ name: 'east' }),
	createOptionsItem({ name: 'north' }),
	createOptionsItem({ name: 'south' }),
	createOptionsItem({ name: 'west' })
];

export const fixtureSectors = [
	createOptionsItem({ name: 'transport' }),
	createOptionsItem({ name: 'water' }),
	createOptionsItem({ name: 'waste' }),
	createOptionsItem({ name: 'energy' }),
	createOptionsItem({ name: 'waste_water' })
];

export const fixtureZoomLevels = [
	createOptionsItem({ name: 'city' }),
	createOptionsItem({ name: 'county' }),
	createOptionsItem({ name: 'junction' }),
	createOptionsItem({ name: 'country' }),
	createOptionsItem({ name: 'region' })
];
