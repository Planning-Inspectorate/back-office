import { isEmpty } from 'lodash-es';
import { databaseConnector } from '#utils/database-connector.js';

/**
 * @typedef {{
 *  representationDetails: { caseId: number, status: string, originalRepresentation?: string | null, redacted: boolean, received: Date },
 *  represented?: { organisationName?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, phoneNumber?: string | null, jobTitle?: string | null, under18: boolean, type: string},
 *  representedAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null},
 *  representative?: { organisationName?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, phoneNumber?: string | null, jobTitle?: string | null, under18: boolean, type: string},
 *  representativeAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} CreateRepresentationParams
 */

/**
 *
 * @param {number} caseId
 * @param {{page: number, pageSize: number}} pagination
 * @param {{searchTerm: string?, filters: Record<string, string[] | boolean>?, sort: object[]?}} filterAndSort
 * @returns {Promise<{count: number, items: any[]}>}
 */
export const getByCaseId = async (caseId, { page, pageSize }, { searchTerm, filters, sort }) => {
	const where = {
		caseId,
		...(searchTerm ? buildSearch(searchTerm) : {}),
		...(filters ? buildFilters(filters) : {})
	};

	const orderBy = buildOrderBy(sort);

	const [count, items] = await databaseConnector.$transaction([
		databaseConnector.representation.count({
			where
		}),
		databaseConnector.representation.findMany({
			select: {
				id: true,
				reference: true,
				status: true,
				redacted: true,
				received: true,
				represented: {
					select: {
						firstName: true,
						lastName: true,
						organisationName: true
					}
				}
			},
			where,
			take: pageSize,
			skip: (page - 1) * pageSize,
			orderBy
		})
	]);

	return {
		count,
		items
	};
};

/**
 *
 * @param {number} id
 * @returns {Promise<Representation | null>}
 */
export const getById = async (id) =>
	databaseConnector.representation.findUnique({
		select: {
			id: true,
			reference: true,
			caseId: true,
			status: true,
			redacted: true,
			received: true,
			originalRepresentation: true,
			redactedRepresentation: true,
			type: true,
			user: {
				select: {
					azureReference: true
				}
			},
			case: {
				select: {
					id: true,
					reference: true
				}
			},
			representedType: true,
			represented: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					organisationName: true,
					jobTitle: true,
					under18: true,
					email: true,
					contactMethod: true,
					phoneNumber: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true,
							country: true
						}
					}
				}
			},
			representative: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					organisationName: true,
					jobTitle: true,
					under18: true,
					email: true,
					contactMethod: true,
					phoneNumber: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true,
							country: true
						}
					}
				}
			},
			representationActions: {
				select: {
					actionBy: true,
					actionDate: true,
					invalidReason: true,
					notes: true,
					previousRedactStatus: true,
					previousStatus: true,
					redactStatus: true,
					referredTo: true,
					status: true,
					type: true
				},
				orderBy: {
					actionDate: 'desc'
				}
			},
			attachments: {
				select: {
					Document: {
						select: {
							isDeleted: true,
							latestDocumentVersion: {
								select: {
									fileName: true
								}
							}
						}
					},
					documentGuid: true,
					id: true
				}
			}
		},
		where: {
			id
		}
	});

/**
 *
 * @param {number} repId
 * @param {number} [caseId]
 * @returns {Promise<Representation>}
 */
export const getFirstById = async (repId, caseId) => {
	let filter = {
		id: repId
	};

	if (caseId) {
		filter = {
			...filter,
			caseId
		};
	}

	return databaseConnector.representation.findFirst({
		where: filter
	});
};

export const getStatusCountByCaseId = async (caseId) => {
	const groupRepStatusWithCount = databaseConnector.representation.groupBy({
		where: { caseId },
		by: ['status'],
		_count: {
			_all: true
		}
	});

	const representedUnder18Count = databaseConnector.representation.count({
		where: {
			caseId,
			represented: {
				under18: true
			}
		}
	});

	return databaseConnector.$transaction([groupRepStatusWithCount, representedUnder18Count]);
};

/**
 * Updates the display name of a represented user based on their organisation name or full name.
 * @param representedId
 * @returns {Promise<void>}
 */
export const updateRepresentedDisplayName = async (representedId) => {
	const existingRepresented = await databaseConnector.serviceUser.findUnique({
		where: { id: representedId },
		select: { organisationName: true, firstName: true, lastName: true, displayName: true }
	});

	const newDisplayName =
		existingRepresented?.organisationName ||
		`${existingRepresented?.firstName} ${existingRepresented?.lastName}`;

	if (existingRepresented?.displayName !== newDisplayName) {
		await databaseConnector.serviceUser.update({
			where: { id: representedId },
			data: { displayName: newDisplayName }
		});
	}
};

/**
 * Creates a Rel Rep record, and then updates it with the short reference.
 * Also creates service users for the contacts if required
 *
 * @param  {CreateRepresentationParams} representationCreateDetails
 */
export const createApplicationRepresentation = async ({
	representationDetails,
	represented,
	representedAddress = {},
	representative,
	representativeAddress = {}
}) => {
	const { caseId, ...representation } = representationDetails;

	representation.case = {
		connect: {
			id: caseId
		}
	};

	representation.represented = {
		create: {
			...represented,
			//...(representedAddress && {
			//	address: {
			//		create: representedAddress
			//	}
			//})
			address: {
				create: representedAddress
			}
		}
	};

	if (!isEmpty(representative)) {
		representation.representative = {
			create: {
				...representative,
				//...(representativeAddress && {
				//	address: {
				//		create: representativeAddress
				//	}
				//})
				address: {
					create: representativeAddress
				}
			}
		};
	}

	const createResponse = await databaseConnector.representation.create({
		data: representation
	});

	if (!isEmpty(represented)) {
		await updateRepresentedDisplayName(createResponse.representedId);
	}

	if (representation.reference) return createResponse;
	else {
		// Using the DB Id to generate a short reference id, references will also be created in FO so prefix id with 'B'
		return databaseConnector.representation.update({
			where: { id: createResponse.id },
			data: {
				reference: generateRepresentationReference(createResponse.id)
			}
		});
	}
};

export const updateApplicationRepresentation = async (
	{
		representationDetails = {},
		represented,
		representedAddress,
		representative,
		representativeAddress
	},
	caseId,
	representationId
) => {
	//  Validate case rep id is on case id
	const response = await getFirstById(representationId, caseId);

	if (!response)
		throw new Error(`Representation Id ${representationId} does not belong to case Id ${caseId}`);

	if (response.status === 'PUBLISHED') representationDetails.unpublishedUpdates = true;

	if (!isEmpty(representationDetails)) {
		await databaseConnector.representation.update({
			where: { id: representationId },
			data: {
				...representationDetails
			}
		});
	}

	if (!isEmpty(represented)) {
		await databaseConnector.representation.update({
			where: {
				id: representationId
			},
			data: {
				represented: {
					update: represented
				}
			}
		});
	}

	if (!isEmpty(representedAddress)) {
		await databaseConnector.serviceUser.update({
			where: {
				id: response.representedId
			},
			data: {
				address: {
					upsert: {
						create: representedAddress,
						update: representedAddress
					}
				}
			}
		});
	}

	if (!isEmpty(representative)) {
		await databaseConnector.representation.update({
			where: {
				id: representationId
			},
			data: {
				representative: {
					upsert: {
						create: representative,
						update: representative
					}
				}
			}
		});
	}

	if (!isEmpty(representativeAddress)) {
		await databaseConnector.serviceUser.update({
			where: {
				id: response.representativeId
			},
			data: {
				address: {
					upsert: {
						create: representativeAddress,
						update: representativeAddress
					}
				}
			}
		});
	}

	if (!isEmpty(represented)) {
		await updateRepresentedDisplayName(response.representedId);
	}

	return getFirstById(representationId, caseId);
};

export const updateApplicationRepresentationRedaction = async (
	{ representation, representationAction },
	caseId,
	representationId
) => {
	//  Validate case rep id is on case id
	const response = await getFirstById(representationId, caseId);

	if (!response)
		throw new Error(`Representation Id ${representationId} does not belong to case Id ${caseId}`);

	if (response.status === 'PUBLISHED') representation.unpublishedUpdates = true;

	if (!isEmpty(representation)) {
		await databaseConnector.representation.update({
			where: { id: representationId },
			data: {
				...representation
			}
		});
	}

	if (!isEmpty(representationAction)) {
		await databaseConnector.representationAction.create({
			data: {
				...representationAction,
				representationId,
				actionDate: new Date(),
				previousRedactStatus: response.redacted
			}
		});
	}

	//  returns updated redacted
	return getFirstById(representationId, caseId);
};

/**
 *
 * @param {string} rawSearchTerm
 * @returns {any}
 */
function buildSearch(rawSearchTerm) {
	const searchTerm = rawSearchTerm.replace(/\s+/, ' ');

	return {
		OR: [
			{
				reference: {
					contains: searchTerm
				}
			},
			{
				originalRepresentation: {
					contains: searchTerm
				}
			},
			{
				represented: {
					OR: [
						{
							organisationName: {
								contains: searchTerm
							}
						},
						...buildSplitContains('firstName', searchTerm),
						...buildSplitContains('lastName', searchTerm)
					]
				}
			}
		]
	};
}

// Attachments

/**
 *
 * @param {number} representationId
 * @param {string} documentId
 * @returns {Promise<*>}
 */
export const addApplicationRepresentationAttachment = async (representationId, documentId) => {
	const representation = await getFirstById(representationId);

	const transactionItems = [
		databaseConnector.representationAttachment.create({
			data: {
				documentGuid: documentId,
				representationId
			}
		})
	];

	if (representation.status === 'PUBLISHED')
		transactionItems.push(
			databaseConnector.representation.update({
				where: { id: representation.id },
				data: {
					unpublishedUpdates: true
				}
			})
		);

	const [representationAttachmentCreateResult] = await databaseConnector.$transaction(
		transactionItems
	);

	return representationAttachmentCreateResult;
};

/**
 *
 * @param {number} representationId
 * @param {string} documentId
 * @returns {Promise<*>}
 */
export const upsertApplicationRepresentationAttachment = async (representationId, documentId) => {
	return databaseConnector.representationAttachment.upsert({
		where: { documentGuid: documentId },
		update: { representationId },
		create: {
			documentGuid: documentId,
			representationId
		}
	});
};

/**
 * Soft deletes an attached document on a representation.
 *
 * @param {number} repId
 * @param {number} attachmentId
 * @returns {Promise<*>}
 */
export const deleteApplicationRepresentationAttachment = async (repId, attachmentId) => {
	// Note: this does NOT delete the record in the associative table RepresentationAttachment,
	//		 it just marks the document as isDeleted in the Document table
	const representation = await getFirstById(repId);

	const transactionItems = [
		databaseConnector.representationAttachment.delete({
			where: { id: attachmentId }
		})
	];

	// if the representation is already published, this also sets the unpublishedUpdates flag on the rep
	if (representation.status === 'PUBLISHED')
		transactionItems.push(
			databaseConnector.representation.update({
				where: { id: representation.id },
				data: {
					unpublishedUpdates: true
				}
			})
		);

	const [representationAttachmentDeleteResult] = await databaseConnector.$transaction(
		transactionItems
	);

	return representationAttachmentDeleteResult;
};

/**
 *
 * @param {Representation} representation
 * @param {object} action
 * @param {boolean} unpublished
 * @returns {Promise<*>}
 */
export const updateApplicationRepresentationStatusById = async (
	representation,
	action,
	unpublished
) => {
	const updateRepStatus = databaseConnector.representation.update({
		where: { id: representation.id },
		data: {
			status: action.status,
			unpublishedUpdates: unpublished ? false : representation.unpublishedUpdates
		}
	});

	const addAction = databaseConnector.representationAction.create({
		data: {
			representationId: representation.id,
			previousStatus: representation.status,
			...action,
			actionDate: new Date()
		}
	});

	const [rep] = await databaseConnector.$transaction([updateRepStatus, addAction]);

	return rep;
};

/**
 * Sets representations as 'published' - set status to PUBLISHED for representations that are newly published,
 * and for representations that have previously been PUBLISHED, set unpublishedUpdates to false
 * @param {Prisma.RepresentationSelect[]} representations
 * @param {string} actionBy User performing publish action
 * @returns {Promise<void>}
 */
export const setRepresentationsAsPublished = async (representations, actionBy) => {
	const transactionItems = [];
	representations
		.filter((rep) => rep.status === 'VALID')
		.forEach((representation) => {
			transactionItems.push(
				databaseConnector.representation.update({
					where: { id: representation.id },
					data: {
						status: 'PUBLISHED'
					}
				})
			);
			transactionItems.push(
				databaseConnector.representationAction.create({
					data: {
						representationId: representation.id,
						previousStatus: representation.status,
						type: 'STATUS',
						status: 'PUBLISHED',
						actionBy: actionBy,
						actionDate: new Date()
					}
				})
			);
		});

	transactionItems.push(
		databaseConnector.representation.updateMany({
			where: {
				id: {
					in: representations.filter((rep) => rep.status === 'PUBLISHED').map((rep) => rep.id)
				}
			},
			data: {
				unpublishedUpdates: false
			}
		})
	);

	await databaseConnector.$transaction(transactionItems);
};

/**
 * Sets representations as 'published' in batches
 * This is required as there is a limit in prisma for the amount of parameters to update in one go
 * @param {Prisma.RepresentationSelect[]} representations
 * @param {string} actionBy User performing publish action
 * @returns {Promise<void>}
 */
export const setRepresentationsAsPublishedBatch = async (representations, actionBy) => {
	const batchSize = 1000;
	for (let i = 0; i < representations.length; i += batchSize) {
		const batch = representations.slice(i, i + batchSize);
		await setRepresentationsAsPublished(batch, actionBy);
		console.info(`updated representations from range ${i} - ${i + batch.length}`);
	}
};

/**
 *
 * @param {number} caseId
 * @param {number} skip
 * @param {number} batchSize
 * @returns {any}
 */
export const getApplicationRepresentationForDownload = async (caseId, skip, batchSize) => {
	return databaseConnector.representation.findMany({
		take: batchSize,
		skip,
		where: { caseId, status: { in: ['VALID', 'PUBLISHED'] } },
		select: {
			reference: true,
			representedType: true,
			represented: {
				select: {
					firstName: true,
					lastName: true,
					organisationName: true,
					contactMethod: true,
					email: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true,
							country: true
						}
					}
				}
			},
			representative: {
				select: {
					firstName: true,
					lastName: true,
					organisationName: true,
					contactMethod: true,
					email: true,
					address: {
						select: {
							addressLine1: true,
							addressLine2: true,
							town: true,
							county: true,
							postcode: true,
							country: true
						}
					}
				}
			}
		}
	});
};

/**
 * Returns representations for the given case id that are 'publishable' - those where status is VALID,
 * or status is PUBLISHED and unpublishedUpdates is true
 * @param {number} caseId
 * @returns {PrismaPromise<GetFindResult<Prisma.RepresentationSelect>[]>}
 */
export const getPublishableRepresentations = async (caseId) => {
	const totalPublishableRepsCount = await databaseConnector.representation.count({
		where: {
			caseId,
			OR: [{ status: 'PUBLISHED', unpublishedUpdates: true }, { status: 'VALID' }]
		}
	});

	const batchSize = 2000;
	const publishableRepsPromises = [];

	for (let i = 0; i < totalPublishableRepsCount; i += batchSize) {
		publishableRepsPromises.push(
			databaseConnector.representation.findMany({
				select: {
					id: true,
					reference: true,
					status: true,
					redacted: true,
					received: true,
					represented: {
						select: {
							firstName: true,
							lastName: true,
							organisationName: true
						}
					}
				},
				where: {
					caseId,
					OR: [{ status: 'PUBLISHED', unpublishedUpdates: true }, { status: 'VALID' }]
				},
				orderBy: [{ status: 'desc' }, { reference: 'asc' }],
				take: batchSize,
				skip: i
			})
		);
	}

	const publishableReps = await Promise.all(publishableRepsPromises);

	return publishableReps.flat();
};

export const isRepresentationsPreviouslyPublished = async (caseId) => {
	const previouslyPublished = await databaseConnector.representation.count({
		where: {
			caseId,
			status: 'PUBLISHED'
		}
	});

	return previouslyPublished > 0;
};

/**
 * Returns representations with the given representation ids that are 'publishable' - those where status is VALID,
 * or status is PUBLISHED and unpublishedUpdates is true
 * @param {number} caseId
 * @param {number[]} representationIds
 * @returns {PrismaPromise<GetFindResult<Prisma.RepresentationSelect>[]>}
 */
export const getPublishableRepresentationsById = async (caseId, representationIds) => {
	const batchSize = 2000;
	const publishableRepsPromises = [];

	for (let i = 0; i < representationIds.length; i += batchSize) {
		const batchIds = representationIds.slice(i, i + batchSize);

		publishableRepsPromises.push(
			databaseConnector.representation.findMany({
				where: {
					caseId,
					id: { in: batchIds },
					OR: [{ status: 'PUBLISHED', unpublishedUpdates: true }, { status: 'VALID' }]
				},
				include: {
					user: true,
					attachments: true,
					case: true,
					represented: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							organisationName: true,
							jobTitle: true,
							under18: true,
							email: true,
							contactMethod: true,
							phoneNumber: true,
							address: {
								select: {
									addressLine1: true,
									addressLine2: true,
									town: true,
									county: true,
									postcode: true,
									country: true
								}
							}
						}
					},
					representative: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							organisationName: true,
							jobTitle: true,
							under18: true,
							email: true,
							contactMethod: true,
							phoneNumber: true,
							address: {
								select: {
									addressLine1: true,
									addressLine2: true,
									town: true,
									county: true,
									postcode: true,
									country: true
								}
							}
						}
					},
					representationActions: true
				}
			})
		);
	}

	const publishableReps = await Promise.all(publishableRepsPromises);

	return publishableReps.flat();
};

/*
 * Return the count of attachments, that haven't been deleted, for a given case
 */
export const getAttachmentCountForCase = async (caseId) => {
	return await databaseConnector.representation.count({
		where: {
			caseId,
			attachments: { some: { Document: { isDeleted: false } } }
		}
	});
};

/**
 *
 * @param {string} field
 * @param {string} searchTerm
 * @returns {any}
 */
function buildSplitContains(field, searchTerm = '') {
	const terms = searchTerm.split(/\s+/);

	return terms.map((term) => ({
		[field]: {
			contains: term
		}
	}));
}

/**
 *
 * @param {Record<string, string[] | boolean>} filters
 * @returns {any}
 */
function buildFilters(filters = {}) {
	return {
		AND: Object.entries(filters).map(([name, values]) => {
			if (Array.isArray(values)) {
				return {
					[name]: {
						in: values
					}
				};
			}

			if (name === 'under18') {
				return {
					represented: {
						under18: values
					}
				};
			}

			if (name === 'withAttachment') {
				return {
					attachments: {
						some: {
							Document: {
								isDeleted: false
							}
						}
					}
				};
			}

			return {
				[name]: values
			};
		})
	};
}

/**
 *
 * @param {object[]?} sort
 * @returns {object[]}
 */
function buildOrderBy(sort) {
	const primarySort = sort || [{ status: 'asc' }];
	const secondarySort =
		sort && sort.some((sortObject) => Object.keys(sortObject)[0] === 'received')
			? []
			: [{ received: 'desc' }];

	return [...primarySort, ...secondarySort, { id: 'asc' }];
}

/**
 *
 * @param {number} id
 * @returns {string}
 */
function generateRepresentationReference(id) {
	return `B${id.toString().padStart(7, '0')}`;
}
