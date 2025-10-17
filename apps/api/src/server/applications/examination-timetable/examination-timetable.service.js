import * as examinationTimetableRepository from '../../repositories/examination-timetable.repository.js';

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.ExaminationTimetable | null>}
 */
export const getByCaseId = async (caseId) => {
	return examinationTimetableRepository.getByCaseId(caseId);
};
