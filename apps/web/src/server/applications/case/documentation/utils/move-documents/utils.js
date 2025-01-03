import { url } from '../../../../../lib/nunjucks-filters/url.js';
import logger from '../../../../../lib/logger.js';
import { getCaseFolders } from '../../applications-documentation.service.js';
import documentationSessionHandlers from '../../applications-documentation.session.js';

const excludedFolders = ['relevant representations', 's51 advice'];

/**
 * @param {number} caseId
 * @param {number} parentFolderId
 * @returns {Promise<import('../../applications-documentation.service.js').DocumentationCategory[]>}
 */
const getFolderList = async (caseId, parentFolderId) => {
	try {
		let folderList = parentFolderId
			? await getCaseFolders(caseId, parentFolderId)
			: await getCaseFolders(caseId);

		return formatFolderList(folderList);
	} catch (error) {
		logger.info(`Failed to fetch folder list: ${error}`);
		return [];
	}
};

/**
 * @param {import('../../applications-documentation.service.js').DocumentationCategory[]} folderList
 * @returns {{text: string, value: number|undefined}[]}

 */
const getFolderViewData = (folderList) =>
	folderList.map((folder) => {
		return { text: folder.displayNameEn, value: folder.id };
	});

/**
 *
 * @param {import('../../applications-documentation.service.js').DocumentationCategory[]} folderList
 */
const isFolderRoot = (folderList) =>
	folderList.every((folder) => folder.parentFolderId === null) && folderList.length > 0;

/**
 *
 * @param {import('../../applications-documentation.service.js').DocumentationCategory[]} folderList
 * @returns {import('../../applications-documentation.service.js').DocumentationCategory[]}
 */
const formatFolderList = (folderList) => {
	return folderList
		.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
		.filter((folder) => !excludedFolders.includes(folder.displayNameEn.toLowerCase()));
};

/**
 * @param {import('../../applications-documentation.service.js').DocumentationCategory[]} folderList
 * @param {number} openFolderId
 * @returns {string|undefined}
 */
const getFolderNameById = (folderList, openFolderId) =>
	folderList.find((folder) => folder.id === openFolderId)?.displayNameEn;

/**
 * @param {*} session
 * @param {number} parentFolderId
 * @param {string|undefined} parentFolderName
 * @returns {{href: string, html: string, id:number}[]}

 */

const buildMoveDocumentsBreadcrumbItems = (session, parentFolderId, parentFolderName) => {
	const currentBreadcrumbs =
		documentationSessionHandlers.getSessionMoveDocumentsBreadcrumbs(session);
	if (!currentBreadcrumbs) return [];
	if (!parentFolderId) return [];

	const breadcrumbItems = [...currentBreadcrumbs];

	//add root folder to crumbs, if it's not there already
	const rootFolderIndex = breadcrumbItems.findIndex((item) => item.id === 0);
	if (rootFolderIndex === -1) {
		breadcrumbItems.unshift({
			href: `./folder-explorer`,
			html: 'Project documentation',
			id: 0
		});
	}

	if (parentFolderId && parentFolderName) {
		//if the current parentId is in breadcrumbs, user went back to previous folder so we trim to that point
		const parentFolderIndex = breadcrumbItems.findIndex((item) => item.id === parentFolderId);
		if (parentFolderIndex > -1) {
			breadcrumbItems.splice(parentFolderIndex + 1);
		} else {
			//otherwise we add the current parent to the crumbs
			breadcrumbItems.push({
				href: encodeURI(
					`./folder-explorer?parentFolderId=${parentFolderId}&parentFolderName=${parentFolderName}`
				),
				html: parentFolderName,
				id: parentFolderId
			});
		}
	}

	breadcrumbItems.forEach((item) => {
		if (!item.html.includes('<span class="folder-icon">')) {
			item.html = `<span class="folder-icon"></span>${item.html}`;
		}
	});

	return breadcrumbItems;
};

/**
 * @param {{href: string, html: string, id:number}[] | undefined} breadcrumbItems
 * @param {number} caseId
 * @param {number} folderId
 * @param {string} folderName
 * @returns {string}
 */
const getBackLinkUrlFromBreadcrumbs = (breadcrumbItems, caseId, folderId, folderName) => {
	const baseURL = url('document-category', {
		caseId: caseId,
		documentationCategory: {
			id: folderId,
			displayNameEn: folderName
		}
	});

	let backLink = '';

	if (!breadcrumbItems || breadcrumbItems.length === 0) {
		return (backLink = `${baseURL}move-documents`);
	}

	if (breadcrumbItems.length > 1) {
		const folderPage = breadcrumbItems[breadcrumbItems.length - 2].href.slice(1);
		backLink = `${baseURL}move-documents${folderPage}`;
	}

	return backLink;
};

export default {
	getFolderList,
	isFolderRoot,
	buildMoveDocumentsBreadcrumbItems,
	getBackLinkUrlFromBreadcrumbs,
	getFolderNameById,
	getFolderViewData,
	formatFolderList
};
