// import { get } from '../../../lib/request.js';

/**
 * Get the timetable item types
 *
 * @returns {Promise<{name: string, templateType: string, displayNameEn: string, displayNameCy: string}[]>}
 */
export const getCaseTimetableItemTypes = async () => {
	// return get(`applications//documents/${fileGuid}/properties`);

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{
					name: 'Accompanied Site Inspection',
					displayNameEn: 'Accompanied site inspection',
					displayNameCy: 'Accompanied site inspection',
					templateType: 'starttime-mandatory'
				},
				{
					name: 'Compulsory Acquisition Hearing',
					displayNameEn: 'Compulsory acquisition hearing',
					displayNameCy: 'Compulsory acquisition hearing',
					templateType: 'deadline'
				},
				{
					name: 'Deadline',
					displayNameEn: 'Deadline',
					displayNameCy: 'Deadline',
					templateType: 'deadline-startdate-mandatory'
				},
				{
					name: 'Deadline For Close Of Examination',
					displayNameEn: 'Deadline for close of examination',
					displayNameCy: 'Deadline for close of examination',
					templateType: 'no-times'
				}
			]);
		}, 300);
	});
};
