// @ts-nocheck
// TODO: schemas (PINS data model)

import config from '#config/config.js';
import { randomUUID } from 'node:crypto';
import validateUuidParameter from '#common/validators/uuid-parameter.js';

export const mapDocumentIn = (doc) => {
	const { filename, ...metadata } = doc;
	const { originalFilename, originalGuid } = mapDocumentUrl(metadata.documentURI, filename);

	let documentGuid = originalGuid;
	if (validateUuidParameter(documentGuid).isUUID()) {
		documentGuid = randomUUID();
	}

	metadata.blobStorageContainer = config.BO_BLOB_CONTAINER;
	metadata.blobStoragePath = `${documentGuid}/v1/${originalFilename}`;

	return {
		...metadata,
		documentGuid,
		fileName: originalFilename,
		dateCreated: (doc.dateCreated ? new Date(doc.dateCreated) : new Date()).toISOString(),
		lastModified: (doc.lastModified ? new Date(doc.lastModified) : new Date()).toISOString()
	};
};

export const mapDocumentOut = (doc) => {
	return doc;
};

const mapDocumentUrl = (documentURI, fileName) => {
	const url = new URL(documentURI);
	if (!url) {
		throw new Error('Invalid document URI');
	}

	const path = url.pathname.split('/').slice(1);
	if (path.length !== 4) {
		return null;
	}
	const originalGuid = path[2];
	let originalFilename = path[3];
	if (fileName !== originalFilename) {
		originalFilename = fileName;
	}

	return {
		originalGuid,
		originalFilename
	};
};
