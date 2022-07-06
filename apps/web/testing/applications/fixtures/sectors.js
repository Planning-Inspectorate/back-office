import { createSector } from '../factory/sector.js';

export const fixtureSectors = [
	createSector({ name: 'transport' }),
	createSector({ name: 'water' }),
	createSector({ name: 'waste' }),
	createSector({ name: 'energy' }),
	createSector({ name: 'waste_water' })
];
