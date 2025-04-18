//@ts-nocheck
import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import { folderNames } from './utils/move-documents/folder-names.js';

export const validateApplicationsDocumentations = createValidator(
	body('selectedFilesIds')
		.isArray({ min: 1 })
		.withMessage('Select documents to make changes to statuses')
);

export const validateApplicationsDocumentsToPublish = createValidator(
	body('selectedFilesIds').isArray({ min: 1 }).withMessage('You must select documents to publish')
);

export const validateApplicationsDocumentsToUnpublish = createValidator(
	body('selectedFilesIds').isArray({ min: 1 }).withMessage('Select documents to unpublish')
);

export const validateApplicationsDocumentationsActions = createValidator(
	body('isRedacted')
		.custom((value, { req }) => !!value || !!req?.body?.status)
		.withMessage('Select a status to apply a change')
);

export const validateApplicationsDocumentationsDeleteStatus = createValidator(
	body('status')
		.custom((value) => value !== 'published')
		.withMessage('This document is published.')
);

export const validateApplicationsDocumentationsFolders = createValidator(
	body('folderName')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Enter folder name')
		.isLength({ max: 255 })
		.withMessage('Folder name must be 255 characters or less')
		.matches(/^[a-zA-Z0-9 _'-]+$/)
		.withMessage(
			'Folder name must only include letters A to Z, numbers and special characters such as spaces, underscores, hyphens and apostrophes'
		)
);

export const validateApplicationsDocumentsToMove = createValidator(
	body('selectedFilesIds').isArray({ min: 1 }).withMessage('Select documents to move')
);

export const validateApplicationsDocumentsToMoveFolderSelection = createValidator(
	body('openFolder').custom((value, { req }) => {
		if (!req.body.openFolder && req.body.action !== 'moveDocuments') {
			throw new Error('Select a folder');
		}
		return true;
	})
);

export const checkDocumentsAreNotPublished = (req) => {
	const filesToMove = req.session.moveDocuments?.documentationFilesToMove;
	const rootFolderList = req.session.moveDocuments?.rootFolderList;
	const parentFolderId = req.body.openFolder;

	const correspondenceFolder = rootFolderList.find(
		(folder) => folder.displayNameEn === folderNames.correspondence
	);

	const openedCorrespondenceFolder = correspondenceFolder?.id === parentFolderId;

	if (openedCorrespondenceFolder) {
		const someFilesArePublished = filesToMove.some((item) => item.publishedStatus === 'published');
		if (someFilesArePublished) {
			throw new Error(
				'One or more of your selected documents is published. You must unpublish the document(s) before moving them to the correspondence folder.'
			);
		}
	}
	return true;
};

export const validateDocumentsToMoveToCorrespondenceNotPublished = createValidator(
	body('openFolder').custom((_, { req }) => {
		const filesToMove = req.session.moveDocuments?.documentationFilesToMove;
		const rootFolderList = req.session.moveDocuments?.rootFolderList;
		const parentFolderId = req.body.openFolder;

		const correspondenceFolder = rootFolderList.find(
			(folder) => folder.displayNameEn === folderNames.correspondence
		);
		const openedCorrespondenceFolder = correspondenceFolder?.id === Number(parentFolderId);

		if (openedCorrespondenceFolder) {
			const someFilesArePublished = filesToMove.some(
				(item) => item.publishedStatus === 'published'
			);
			if (someFilesArePublished) {
				throw new Error(
					'One or more of your selected documents are published. You must unpublish the document(s) before moving them to the correspondence folder.'
				);
			}
		}
		return true;
	})
);
