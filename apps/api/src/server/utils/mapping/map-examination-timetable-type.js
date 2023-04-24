import { pick } from 'lodash-es';

/**
 * @param {import('@pins/api').Schema.ExaminationTimetableType} examinationTimetableType
 * @returns {{name: string, displayNameEn: string, displayNameCy: string}}
 */
export const mapExaminationTimetableType = (examinationTimetableType) => {
	return pick(examinationTimetableType, ['id', 'name', 'displayNameEn', 'displayNameCy']);
};
