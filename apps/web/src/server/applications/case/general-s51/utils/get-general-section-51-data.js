import { findCaseByCaseReference } from '../../../applications.service.js';
import { getCaseFolders } from '../../documentation/applications-documentation.service.js';
import { generalSection51CaseReference, generalSection51FolderName } from '../applications-general-s51.config.js';

/**
 * 
 * @returns {Promise<any>}
 
 */
export const getGeneralSection51Data = async () => {

	try {
		const gs51Case = await findCaseByCaseReference(generalSection51CaseReference)
		const gs51CaseFolders = await getCaseFolders(gs51Case.id)
		
		const gs51Folder = gs51CaseFolders.find(folder => folder.displayNameEn.toLowerCase() === generalSection51FolderName.toLowerCase())

		return {
			caseId: gs51Case.id,
			folderId: gs51Folder?.id
		} 
		
	} catch (error) {
		console.log(`Failed to establish general section 51 data: `, error);
	}
};