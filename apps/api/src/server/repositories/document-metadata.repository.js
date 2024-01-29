import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@prisma/client').DocumentVersion} DocumentVersion
 * @typedef {import('@pins/applications.api').Schema.DocumentVersionWithDocument} DocumentVersionWithDocument
 * @typedef {import('@pins/applications.api').Schema.DocumentUpdateInput} DocumentUpdateInput
 */

/**

 * @param {DocumentVersion} metadata
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion>}
 */
export const upsert = ({ documentGuid, version = 1, transcriptGuid, ...metadata }) => {
	return databaseConnector.documentVersion.upsert({
		create: {
			...metadata,
			version,
			...(transcriptGuid ? { transcript: { connect: { guid: transcriptGuid } } } : {}),
			Document: { connect: { guid: documentGuid } }
		},

		where: { documentGuid_version: { documentGuid, version } },

		update: {
			...metadata,
			transcriptGuid,
			version
		},

		include: {
			Document: {
				include: {
					folder: {
						include: {
							// TODO: This will never work for nested folders, need to refactor to use new denormalised Case
							case: {
								include: {
									CaseStatus: true
								}
							}
						}
					}
				}
			}
		}
	});
};

/**

 * @param {{guid: string, status: string, version?: number }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion>}
 */
export const updateDocumentStatus = ({ guid, status, version = 1 }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid: guid, version } },
		data: { publishedStatus: status },
		include: {
			Document: {
				include: {
					case: true
				}
			}
		}
	});
};

/**

 * @param {{guid: string, status: string, version?: number, datePublished?: Date }} documentStatusUpdate
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion>}
 */
export const updateDocumentPublishedStatus = ({ guid, status, version = 1, datePublished }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid: guid, version } },
		data: { publishedStatus: status, datePublished },
		include: {
			Document: {
				include: {
					case: true
				}
			}
		}
	});
};

/**
 *  Hard-Deletes a document from the database based on its `guid`
 *
 * @async
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<Document>}
 */
export const deleteDocument = (documentGuid) => {
	return databaseConnector.document.delete({
		where: {
			guid: documentGuid
		}
	});
};

/**

 * Get a document metadata by documentGuid
 *
 * @param {string} documentGuid
 * @param {number} version
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion |null>}
 */
export const getById = (documentGuid, version = 1) => {
	return databaseConnector.documentVersion.findUnique({
		where: { documentGuid_version: { documentGuid, version } },

		include: {
			Document: {
				include: {
					folder: {
						include: {
							case: {
								include: {
									CaseStatus: true
								}
							}
						}
					}
				}
			},
			DocumentActivityLog: {
				orderBy: {
					createdAt: 'desc'
				}
			},
			transcript: {
				select: {
					reference: true
				}
			}
		}
	});
};

/**

 * Get info for many documents by documentGuid and published status
 *
 * @param {string[]} documentGuids
 * @param {string} [publishedStatus]
 * @returns {import('@prisma/client').PrismaPromise<Array<DocumentVersion |null>>}
 */
export const getManyByIdAndStatus = (documentGuids, publishedStatus) => {
	return databaseConnector.documentVersion.findMany({
		where: {
			documentGuid: {
				in: documentGuids
			},
			publishedStatus,
			isDeleted: false
		}
	});
};

/**
 * Get all document metadata
 *
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion[] |null>}
 */
export const getAll = () => {
	return databaseConnector.documentVersion.findMany();
};

/**
 * Get 'all' published versions of a document (there should only be one)
 *
 * @param {string} documentGuid
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.DocumentVersion[] |null>}
 * */
export const getPublished = (documentGuid) => {
	return databaseConnector.documentVersion.findMany({
		where: { documentGuid, publishedStatus: 'published', isDeleted: false }
	});
};

/**
 * Get all document metadata
 *
 * @param {string} guid
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion[] |null>}
 */
export const getAllByDocumentGuid = (guid) => {
	return databaseConnector.documentVersion.findMany({
		include: { DocumentActivityLog: true },
		where: { documentGuid: guid, isDeleted: false },
		orderBy: { version: 'desc' }
	});
};

/**
 * Update a single DocumentVersion record
 *
 * @param {string} documentGuid
 * @param {import('@pins/applications.api').Schema.DocumentVersionUpdateInput} documentDetails
 * @returns {import('@prisma/client').PrismaPromise<DocumentVersion>}
 */
export const update = (documentGuid, { version = 1, ...documentDetails }) => {
	return databaseConnector.documentVersion.update({
		where: { documentGuid_version: { documentGuid, version } },
		include: {
			Document: {
				include: {
					case: true
				}
			}
		},
		data: documentDetails
	});
};

// update DocumentVersion
// join Document on document.latestVersionId =

/**
 * TODO: Might be worth having an identifier for DocumentVersion that isn't a composite of the documentId and versionNo.
 * It would make it easier to work with these items in bulk using Prisma.
 *
 * @param {{documentGuid: string, version: number}[]} documentVersionIds
 * @param {DocumentUpdateInput} documentDetails
 * @returns {Promise<DocumentVersionWithDocument[]>}
 */
export const updateAll = async (documentVersionIds, documentDetails) => {
	const results = [];

	for (const { documentGuid, version } of documentVersionIds) {
		const result = await databaseConnector.documentVersion.update({
			where: { documentGuid_version: { documentGuid, version } },
			data: documentDetails,
			include: {
				Document: {
					include: {
						case: true
					}
				}
			}
		});

		results.push(result);
	}

	return results;
};

/**
 * Set publishedStatus of training cases to 'published', and non-training cases to 'publishing'.
 *
 * @param {{documentGuid: string, version: number}[]} documentVersionIds
 * @returns {Promise<DocumentVersionWithDocument[]>}
 */
export const publishMany = async (documentVersionIds) => {
	const results = [];

	for (const documentGuid_version of documentVersionIds) {
		const current = await databaseConnector.documentVersion.findUnique({
			where: { documentGuid_version },
			include: {
				Document: {
					include: {
						case: {
							include: {
								ApplicationDetails: {
									include: {
										subSector: {
											include: {
												sector: true
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});

		const isTraining =
			current?.Document?.case?.ApplicationDetails?.subSector?.sector.name === 'training';

		const result = await databaseConnector.documentVersion.update({
			where: { documentGuid_version },
			data: {
				publishedStatus: isTraining ? 'published' : 'publishing',
				publishedStatusPrev: current?.publishedStatus
			}
		});

		results.push(result);
	}

	return results;
};

/**
 * Set publishedStatus of training cases to 'unpublished', and non-training cases to 'unpublishing'.
 *
 * @param {{documentGuid: string, version: number}[]} documentVersionIds
 * @returns {Promise<DocumentVersionWithDocument[]>}
 */
export const unpublishMany = async (documentVersionIds) => {
	const results = [];

	for (const documentGuid_version of documentVersionIds) {
		const current = await databaseConnector.documentVersion.findUnique({
			where: { documentGuid_version },
			include: {
				Document: {
					include: {
						case: {
							include: {
								ApplicationDetails: {
									include: {
										subSector: {
											include: {
												sector: true
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});

		const isTraining =
			current?.Document?.case?.ApplicationDetails?.subSector?.sector.name === 'training';

		const result = await databaseConnector.documentVersion.update({
			where: { documentGuid_version },
			data: {
				publishedStatus: isTraining ? 'unpublished' : 'unpublishing',
				publishedStatusPrev: current?.publishedStatus
			}
		});

		results.push(result);
	}

	return results;
};
