import { isEmpty, map } from 'lodash-es';
import { databaseConnector } from '../utils/database-connector.js';

const DEFAULT_CASE_CREATE_STATUS = 'draft';

/**
 * @returns {Promise<import('@pins/api').Schema.Case[]>}
 */
export const getAll = () => {
	return databaseConnector.case.findMany({
		include: {
			ApplicationDetails: {
				include: {
					subSector: {
						include: {
							sector: true
						}
					},
					zoomLevel: true
				}
			},
			CaseStatus: {
				where: {
					valid: true
				}
			},
			gridReference: true,
		}
	});
};

/**
 * @param {string} status
 * @returns {Promise<import('@pins/api').Schema.Case[]>}
 */
export const getByStatus = (status) => {
	return databaseConnector.case.findMany({
		where: {
			CaseStatus: {
				some: {
					status,
					valid: true
				}
			}
		},
		include: {
			ApplicationDetails: {
				include: {
					subSector: {
						include: {
							sector: true
						}
					}
				}
			},
			CaseStatus: {
				where: {
					valid: true
				}
			}
		}
	});
};

/**
 * @param {string} query
 * @param {number} skipValue
 * @param {number} pageSize
 * @returns {Promise<import('@pins/api').Schema.Case[]>}
 */
export const getBySearchCriteria = (query, skipValue, pageSize) => {
	return databaseConnector.case.findMany({
		skip: skipValue,
		take: pageSize,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			OR: [
				{
					title: { contains: query }
				},
				{
					reference: { contains: query }
				},
				{
					description: { contains: query }
				}
			]
		},
		include: {
			ApplicationDetails: {
				include: {
					subSector: {
						include: {
							sector: true
						}
					}
				}
			},
			CaseStatus: true
		}
	});
};

/**
 * @param {string} query
 * @returns {Promise<number>}
 */
export const getApplicationsCountBySearchCriteria = (query) => {
	return databaseConnector.case.count({
		where: {
			OR: [
				{
					title: { contains: query }
				},
				{
					reference: { contains: query }
				},
				{
					description: { contains: query }
				}
			]
		}
	});
};

/**
 * @param {{
 *  caseDetails?: { title?: string | undefined, description?: string | undefined },
 * 	gridReference?: { easting?: number | undefined, northing?: number | undefined },
 *  application?: { locationDescription?: string | undefined, firstNotifiedAt?: Date | undefined, submissionAt?: Date | undefined, caseEmail?: string | undefined },
 *  subSectorName?: string | undefined,
 *  applicant?: { organisationName?: string | undefined, firstName?: string | undefined, middleName?: string | undefined, lastName?: string | undefined, email?: string | undefined, website?: string | undefined, phoneNumber?: string | undefined},
 *  mapZoomLevelName?: string | undefined,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | undefined, addressLine2?: string | undefined, town?: string | undefined, county?: string | undefined, postcode?: string | undefined}}} caseInfo
 * @returns {Promise<import('@pins/api').Schema.Case>}
 */
export const createApplication = ({
	caseDetails,
	gridReference,
	application,
	mapZoomLevelName,
	subSectorName,
	regionNames,
	applicant,
	applicantAddress
}) => {
	const formattedRegionNames = map(regionNames, (/** @type {string} */ regionName) => {
		return { region: { connect: { name: regionName } } };
	});

	return databaseConnector.case.create({
		data: {
			...caseDetails,
			...(!isEmpty(gridReference) && { gridReference: { create: gridReference } }),
			...((!isEmpty(application) || subSectorName || mapZoomLevelName || regionNames) && {
				ApplicationDetails: {
					create: {
						...application,
						...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
						...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } }),
						...(regionNames && { regions: { create: formattedRegionNames } })
					}
				}
			}),
			...((!isEmpty(applicant) || !isEmpty(applicantAddress)) && {
				serviceCustomer: {
					create: {
						...applicant,
						...(!isEmpty(applicantAddress) && { address: { create: applicantAddress } })
					}
				}
			}),
			CaseStatus: {
				create: {
					status: DEFAULT_CASE_CREATE_STATUS
				}
			}
		},
		include: {
			serviceCustomer: true
		}
	});
};

/**
 * @param {{
 *  caseId: number,
 *  applicantId?: number,
 *  caseDetails?: { title?: string | undefined, description?: string | undefined },
 * 	gridReference?: { easting?: number | undefined, northing?: number | undefined },
 *  application?: { locationDescription?: string | undefined, firstNotifiedAt?: Date | undefined, submissionAt?: Date | undefined, caseEmail?: string | undefined },
 *  subSectorName?: string | undefined,
 *  applicant?: { organisationName?: string | undefined, firstName?: string | undefined, middleName?: string | undefined, lastName?: string | undefined, email?: string | undefined, website?: string | undefined, phoneNumber?: string | undefined},
 *  mapZoomLevelName?: string | undefined,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | undefined, addressLine2?: string | undefined, town?: string | undefined, county?: string | undefined, postcode?: string | undefined}}} caseInfo
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const updateApplication = ({
	caseId,
	applicantId,
	caseDetails,
	gridReference,
	application,
	subSectorName,
	regionNames,
	mapZoomLevelName,
	applicant,
	applicantAddress
}) => {
	const formattedRegionNames = map(regionNames, (/** @type {string} */ regionName) => {
		return { region: { connect: { name: regionName } } };
	});

	const transactions = [];

	if (typeof regionNames !== 'undefined') {
		transactions.push(
			databaseConnector.regionsOnApplicationDetails.deleteMany({
				where: {
					applicationDetails: {
						caseId
					}
				}
			})
		);
	}

	transactions.push(
		databaseConnector.case.update({
			where: { id: caseId },
			data: {
				modifiedAt: new Date(),
				...caseDetails,
				...(!isEmpty(gridReference) && {
					gridReference: {
						upsert: {
							create: gridReference,
							update: gridReference
						}
					}
				}),
				...((!isEmpty(application) ||
					subSectorName ||
					mapZoomLevelName ||
					typeof regionNames !== 'undefined') && {
					ApplicationDetails: {
						upsert: {
							create: {
								...application,
								...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
								...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } }),
								...(regionNames && { regions: { create: formattedRegionNames } })
							},
							update: {
								...application,
								...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
								...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } }),
								...(regionNames && { regions: { create: formattedRegionNames } })
							}
						}
					}
				}),
				...((!isEmpty(applicant) || !isEmpty(applicantAddress)) &&
					applicantId && {
						serviceCustomer: {
							update: {
								data: {
									...applicant,
									...(!isEmpty(applicantAddress) && {
										address: { upsert: { create: applicantAddress, update: applicantAddress } }
									})
								},
								where: {
									id: applicantId
								}
							}
						}
					}),
				...((!isEmpty(applicant) || !isEmpty(applicantAddress)) &&
					!applicantId && {
						serviceCustomer: {
							create: {
								...applicant,
								...(!isEmpty(applicantAddress) && {
									address: { create: applicantAddress }
								})
							}
						}
					})
			},
			include: {
				serviceCustomer: true
			}
		})
	);

	return databaseConnector.$transaction(transactions);
};

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.Case | null>}
 */
export const getById = (id) => {
	return databaseConnector.case.findUnique({ where: { id } });
};
