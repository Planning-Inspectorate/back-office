import { format } from 'date-fns';

/**
 *
 * @param {string} documentName
 * @returns {string}
 */
export const generateDocumentNameOnDeletion = (documentName) => {
	const deletionDate = new Date();
	const dateFormat = 'yyyyMMdd_HHmmss';

	const formattedDeletionDate = format(deletionDate, dateFormat);

	return `${documentName}_deleted_${formattedDeletionDate}`;
};
