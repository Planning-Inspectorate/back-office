// @ts-nocheck
// TODO: schemas (PINS data model)

import { randomUUID } from 'node:crypto';

export const mapDocumentIn = (doc) => {
	const { filename, ...props } = doc;
	const { documentURI, blobStorageContainer, blobStoragePath, ...metadata } = props;
	const { container, path } = mapDocumentUrl(documentURI);

	if (blobStorageContainer !== container) {
		metadata.blobStorageContainer = container;
	}

	if (blobStoragePath !== path) {
		metadata.blobStoragePath = path;
	}

	return {
		...metadata,
		documentGuid: doc.documentGuid ? doc.documentGuid : randomUUID(),
		fileName: filename || doc.fileName,
		dateCreated: (doc.dateCreated ? new Date(doc.dateCreated) : new Date()).toISOString(),
		lastModified: (doc.lastModified ? new Date(doc.lastModified) : new Date()).toISOString()
	};
};

export const mapDocumentOut = (doc) => {
	return doc;
};

const mapDocumentUrl = (documentURI) => {
	const url = new URL(documentURI);
	if (!url) {
		return null;
	}

	const path = url.pathname.split('/').slice(1);
	return {
		blobStorageUrl: url.origin,
		container: path[0],
		path: path.slice(1).join('/')
	};
};
