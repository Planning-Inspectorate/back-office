import { getGeneralSection51URL } from './utils/get-general-section-51-URL.js';
import { getGeneralSection51Data } from './utils/get-general-section-51-data.js';

/**
 *
 * @type {import('@pins/express').RenderHandler<{}, {}, {}, {}, {}>}
 */
export const viewGeneralSection51page = async (req, res) => {
    const { caseId, folderId } = await getGeneralSection51Data();
    const generalSection51URL = getGeneralSection51URL(caseId, folderId);


    return res.redirect(generalSection51URL);
}