import { isEmpty } from 'lodash-es';
import { databaseConnector } from '../utils/database-connector.js';

/**
 * @typedef {{
 *  representationDetails: { caseId: number, status: string, originalRepresentation?: string | null, redacted: boolean, received: Date },
 *  represented?: { organisationName?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, phoneNumber?: string | null, jobTitle?: string | null, under18: boolean, type: string},
 *  representedAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null},
 *  representative?: { organisationName?: string | null, firstName?: string | null, lastName?: string | null, email?: string | null, phoneNumber?: string | null, jobTitle?: string | null, under18: boolean, type: string},
 *  representedAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} CreateRepresentationParams
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
				contacts: {
					select: {
						firstName: true,
						lastName: true,
						organisationName: true
					},
					where: {
						OR: [
							{
								NOT: { type: 'AGENT' }
							},
							{
								type: null
							}
						]
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
 * @param {number?} caseId
 * @returns {Promise<any>}
 */
export const getById = async (id, caseId) => {
	let caseFilter = {};

	if (caseId) {
		caseFilter = {
			case: {
				id: caseId
			}
		};
	}

	const representations = await databaseConnector.representation.findMany({
		select: {
			id: true,
			reference: true,
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
			contacts: {
				select: {
					id: true,
					type: true,
					firstName: true,
					lastName: true,
					organisationName: true,
					jobTitle: true,
					under18: true,
					contactMethod: true,
					email: true,
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
					type: true,
					actionBy: true,
					redactStatus: true,
					previousRedactStatus: true,
					status: true,
					previousStatus: true,
					invalidReason: true,
					referredTo: true,
					actionDate: true,
					notes: true
				},
				orderBy: {
					actionDate: 'asc'
				}
			},
			attachments: {
				select: {
					id: true,
					documentGuid: true,
					Document: true
				}
			}
		},
		where: {
			id,
			...caseFilter
		}
	});

	return representations[0];
};

/**
 * @param  {CreateRepresentationParams} representationCreateDetails
 */
export const createApplicationRepresentation = async ({
	representationDetails,
	represented,
	representedAddress,
	representative,
	representativeAddress
}) => {
	const representation = {
		...representationDetails
	};

	representation.contacts = {
		create: [
			{
				...represented,
				address: {
					create: {
						...representedAddress
					}
				}
			}
		]
	};
	if (!isEmpty(representative)) {
		representation.contacts.create.push({
			...representative,
			address: {
				create: {
					...representativeAddress
				}
			}
		});
	}

	const createResponse = await databaseConnector.representation.create({
		data: {
			...representation
		}
	});

	// Using the DB Id to generate a short reference id, references will also be created in FO so prefix id with 'B'
	return databaseConnector.representation.update({
		where: { id: createResponse.id },
		data: {
			reference: generateRepresentationReference(createResponse.id)
		}
	});
};

export const updateApplicationRepresentation = async (
	{ representationDetails, represented, representedAddress, representative, representativeAddress },
	caseId,
	representationId
) => {
	//  Validate case rep id is on case id
	const response = await databaseConnector.representation.findFirst({
		where: { id: representationId, caseId }
	});

	if (!response)
		throw new Error(`Representation Id ${representationId} does not belong to case Id ${caseId}`);

	const whereIsRepresented = {
		OR: [
			{
				NOT: { type: 'AGENT' }
			},
			{
				type: null
			}
		],
		AND: {
			representationId
		}
	};

	const whereIsRepresentative = {
		representationId,
		type: { in: ['AGENT'] }
	};
	const findRepresentationContactRepresented = async () =>
		databaseConnector.representationContact.findFirst({
			where: whereIsRepresented
		});
	const findRepresentationContactRepresentative = async () =>
		databaseConnector.representationContact.findFirst({
			where: whereIsRepresentative
		});

	if (!isEmpty(representationDetails)) {
		await databaseConnector.representation.update({
			where: { id: representationId },
			data: {
				...representationDetails
			}
		});
	}

	if (!isEmpty(represented)) {
		const data = await findRepresentationContactRepresented();

		await databaseConnector.representationContact.update({
			where: {
				id: data.id
			},
			data: {
				...represented
			}
		});
	}

	if (!isEmpty(representedAddress)) {
		const data = await databaseConnector.representationContact.findFirst({
			where: whereIsRepresented
		});

		await databaseConnector.representationContact.update({
			where: {
				id: data.id
			},
			data: {
				address: {
					update: {
						...representedAddress
					}
				}
			}
		});
	}

	if (!isEmpty(representative)) {
		try {
			const data = await findRepresentationContactRepresentative();

			await databaseConnector.representationContact.update({
				where: {
					id: data.id
				},
				data: {
					...representative
				}
			});
		} catch (e) {
			await databaseConnector.representationContact.create({
				data: {
					...representative,
					representationId
				}
			});
		}
	}

	if (!isEmpty(representativeAddress)) {
		const data = await databaseConnector.representationContact.findFirst({
			where: whereIsRepresentative
		});

		await databaseConnector.representationContact.update({
			where: {
				id: data.id
			},
			data: {
				address: {
					upsert: {
						create: {
							...representativeAddress
						},
						update: {
							...representativeAddress
						}
					}
				}
			}
		});
	}

	return databaseConnector.representation.findFirst({
		where: { id: representationId, caseId }
	});
};

export const updateApplicationRepresentationRedaction = async (
	{ representation, representationAction },
	caseId,
	representationId
) => {
	//  Validate case rep id is on case id
	const response = await databaseConnector.representation.findFirst({
		where: { id: representationId, caseId }
	});

	if (!response)
		throw new Error(`Representation Id ${representationId} does not belong to case Id ${caseId}`);

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
	return databaseConnector.representation.findFirst({
		where: { id: representationId, caseId }
	});
};

/**
 *
 * @param repId
 * @param contactId
 * @return {Prisma.Prisma__RepresentationContactClient<Prisma.RepresentationContactGetPayload<{where: {id}}>>}
 */
export const deleteApplicationRepresentationContact = async (repId, contactId) => {
	const data = await databaseConnector.representationContact.findFirst({
		where: { id: contactId }
	});

	const deleteAddressById = [];

	if (data.addressId) {
		deleteAddressById.push(
			databaseConnector.address.delete({
				where: { id: Number(data.addressId) }
			})
		);
	}

	const deleteRepresentationContactById = databaseConnector.representationContact.delete({
		where: { id: contactId }
	});

	return databaseConnector.$transaction([...deleteAddressById, deleteRepresentationContactById]);
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
				contacts: {
					some: {
						// Exclude agent contact from search
						NOT: {
							type: 'AGENT'
						},
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
	return databaseConnector.representationAttachment.create({
		data: {
			documentGuid: documentId,
			representationId
		}
	});
};

/**
 *
 * @param {number} attachmentId
 * @returns {Promise<*>}
 */
export const deleteApplicationRepresentationAttachment = async (attachmentId) => {
	return databaseConnector.representationAttachment.delete({
		where: { id: attachmentId }
	});
};

/**
 *
 * @param {number} repId
 * @param {object}action
 * @returns {Promise<*>}
 */
export const updateApplicationRepresentationStatus = async (repId, action) => {
	const representation = await databaseConnector.representation.findFirst({ where: { id: repId } });

	const updateRepStatus = databaseConnector.representation.update({
		where: { id: repId },
		data: {
			status: action.status
		}
	});

	const addAction = databaseConnector.representationAction.create({
		data: {
			representationId: repId,
			previousStatus: representation.status,
			...action,
			actionDate: new Date()
		}
	});

	const [rep] = await databaseConnector.$transaction([updateRepStatus, addAction]);

	return rep;
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
					contacts: {
						some: {
							NOT: {
								type: 'AGENT'
							},
							under18: values
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
			: [{ received: 'asc' }];

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
