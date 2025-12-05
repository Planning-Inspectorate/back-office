import { PROJECT_TYPES } from '../../constants.js';

export const PROJECT_TYPES_VIEW = {
	[PROJECT_TYPES.ENERGY_FROM_WASTE]: {
		displayNameEn: 'Energy from waste'
	},
	[PROJECT_TYPES.GAS_POWER_STATION]: {
		displayNameEn: 'Gas power station'
	},
	[PROJECT_TYPES.HYDROGEN_POWER_STATION]: {
		displayNameEn: 'Hydrogen power station'
	},
	[PROJECT_TYPES.NUCLEAR]: {
		displayNameEn: 'Nuclear'
	},
	[PROJECT_TYPES.OFFSHORE_WIND]: {
		displayNameEn: 'Offshore wind'
	},
	[PROJECT_TYPES.ONSHORE_WIND]: {
		displayNameEn: 'Onshore wind'
	},
	[PROJECT_TYPES.SOLAR]: {
		displayNameEn: 'Solar'
	}
};

/**
 * View model to map project types to radio button options.
 *
 * @returns {Array<{name: string, displayNameEn: string}>}
 */
export function getProjectTypesViewModel() {
	return Object.entries(PROJECT_TYPES_VIEW).map(([key, value]) => ({
		name: key,
		displayNameEn: value.displayNameEn
	}));
}

/**
 *
 * @param {string} projectType
 * @returns {string}
 */
export const getProjectTypeDisplayName = (projectType) => {
	if (!projectType) {
		return '';
	}
	const projectTypeEntry = PROJECT_TYPES_VIEW[projectType];
	return projectTypeEntry.displayNameEn;
};
