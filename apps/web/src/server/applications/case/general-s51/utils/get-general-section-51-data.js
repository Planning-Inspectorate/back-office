import { BO_GENERAL_S51_CASE_REF, GENERAL_S51_FOLDER_NAME } from '@pins/applications';
import { findCaseByCaseReference } from '../../../applications.service.js';
import { getCaseFolders } from '../../documentation/applications-documentation.service.js';

/**
 * 
 * @returns {Promise<any>}
 
 */
export const getGeneralSection51Data = async () => {
	try {
		const gs51Case = await findCaseByCaseReference(BO_GENERAL_S51_CASE_REF);
		const gs51CaseFolders = await getCaseFolders(gs51Case.id);

		const gs51Folder = gs51CaseFolders.find(
			(folder) => folder.displayNameEn.toLowerCase() === GENERAL_S51_FOLDER_NAME.toLowerCase()
		);

		return {
			caseId: gs51Case.id,
			folderId: gs51Folder?.id
		};
	} catch (error) {
		console.log(`Failed to establish general section 51 data: `, error);
	}
};
