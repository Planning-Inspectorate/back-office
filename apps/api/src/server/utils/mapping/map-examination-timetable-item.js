import { pick } from 'lodash-es';

/**
 * @typedef {{examinationTypeId: number, name: string, description?: string, 'date': Date, startDate?: Date, startTime?: any, endTime?: any}} ExaminationTimetableUpdateRequest
 */

/**
 * map body object into ExaminationTimetableItem
 *
 * @param {*} examinationTimetableItemDetails
 * @returns {ExaminationTimetableUpdateRequest}
 */
export const mapUpdateExaminationTimetableItemRequest = (examinationTimetableItemDetails) => {
	const /** @type {ExaminationTimetableUpdateRequest} */ formattedDetails = pick(
			examinationTimetableItemDetails,
			[
				'name',
				'nameWelsh',
				'examinationTypeId',
				'description',
				'descriptionWelsh',
				'date',
				'startDate',
				'startTime',
				'endTime'
			]
		);
	return formattedDetails;
};
