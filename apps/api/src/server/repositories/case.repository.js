import { forEach, isEmpty, isString, map } from 'lodash-es';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { databaseConnector } from '../utils/database-connector.js';
import logger from '../utils/logger.js';
import { mapDateStringToUnixTimestamp } from '../utils/mapping/map-date-string-to-unix-timestamp.js';
import { separateStatusesToSaveAndInvalidate } from './separate-statuses-to-save-and-invalidate.js';

const DEFAULT_CASE_CREATE_STATUS = 'draft';

/**
 * @typedef {{
 *  caseDetails?: { title?: string | null, description?: string | null },
 * 	gridReference?: { easting?: number | null, northing?: number | null },
 *  applicationDetails?: { locationDescription?: string | null, submissionAtInternal?: Date | null, submissionAtPublished?: string | null, caseEmail?: string | null },
 *  subSectorName?: string | null,
 *  applicant?: { organisationName?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, email?: string | null, website?: string | null, phoneNumber?: string | null},
 *  mapZoomLevelName?: string | null,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} CreateApplicationParams
 */

/**
 * @typedef {{
 *  caseId: number,
 *  applicantId?: number,
 *  caseDetails?: { title?: string | null, description?: string | null },
 * 	gridReference?: { easting?: number | null, northing?: number | null },
 *  applicationDetails?: { locationDescription?: string | null, submissionAtInternal?: Date | null, submissionAtPublished?: string | null, caseEmail?: string | null },
 *  subSectorName?: string | null,
 *  applicant?: { organisationName?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, email?: string | null, website?: string | null, phoneNumber?: string | null},
 *  mapZoomLevelName?: string | null,
 *  regionNames?: string[],
 *  publishedAt?: Date,
 *  applicantAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} UpdateApplicationParams
 */

/**
 * @template A
 * @typedef {import('@prisma/client').PrismaPromise<A>} PrismaPromise<A>
 */

/**
 * @param {string[]} statusArray
 * @returns {PrismaPromise<import('@pins/api').Schema.Case[]>}
 */
export const getByStatus = (statusArray) => {
	return databaseConnector.case.findMany({
		where: {
			CaseStatus: {
				some: {
					status: {
						in: statusArray
					},
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
 * @returns {PrismaPromise<import('@pins/api').Schema.Case[]>}
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
 * @returns {PrismaPromise<number>}
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
 * @param {CreateApplicationParams} caseInfo
 * @returns {PrismaPromise<import('@pins/api').Schema.Case>}
 */
export const createApplication = ({
	caseDetails,
	gridReference,
	applicationDetails,
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
			...((!isEmpty(applicationDetails) || subSectorName || mapZoomLevelName || regionNames) && {
				ApplicationDetails: {
					create: {
						...applicationDetails,
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
 *
 * @param {number} caseId
 * @returns {PrismaPromise<import('@pins/api').Schema.BatchPayload>}
 */
const removeRegions = (caseId) => {
	return databaseConnector.regionsOnApplicationDetails.deleteMany({
		where: {
			applicationDetails: {
				caseId
			}
		}
	});
};

/**
 * @param {UpdateApplicationParams} data
 * @returns {PrismaPromise<import('@pins/api').Schema.Case>}
 */
const updateApplicationSansRegionsRemoval = ({
	caseId,
	applicantId,
	caseDetails,
	gridReference,
	applicationDetails,
	subSectorName,
	regionNames,
	mapZoomLevelName,
	applicant,
	applicantAddress
}) => {
	const formattedRegionNames = map(regionNames, (/** @type {string} */ regionName) => {
		return { region: { connect: { name: regionName } } };
	});

	return databaseConnector.case.update({
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
			...((!isEmpty(applicationDetails) ||
				subSectorName ||
				mapZoomLevelName ||
				typeof regionNames !== 'undefined') && {
				ApplicationDetails: {
					upsert: {
						create: {
							...applicationDetails,
							...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
							...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } }),
							...(regionNames && { regions: { create: formattedRegionNames } })
						},
						update: {
							...applicationDetails,
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
	});
};

/**
 * @param {UpdateApplicationParams} caseInfo
 * @returns {PrismaPromise<import('@pins/api').Schema.BatchPayload>}
 */
export const updateApplication = ({
	caseId,
	applicantId,
	caseDetails,
	gridReference,
	applicationDetails,
	subSectorName,
	regionNames,
	mapZoomLevelName,
	applicant,
	applicantAddress
}) => {
	const transactions = [];

	if (typeof regionNames !== 'undefined') {
		transactions.push(removeRegions(caseId));
	}

	transactions.push(
		updateApplicationSansRegionsRemoval({
			caseId,
			applicantId,
			caseDetails,
			gridReference,
			applicationDetails,
			subSectorName,
			regionNames,
			mapZoomLevelName,
			applicant,
			applicantAddress
		})
	);

	return databaseConnector.$transaction(transactions);
};

/**
 * @param {UpdateApplicationParams} caseInfo
 * @returns {Promise<number>}
 */
export const publishCase = async ({ caseId }) => {
	const publishedCase = await databaseConnector.case.update({
		where: { id: caseId },
		data: {
			publishedAt: new Date()
		}
	});

	logger.info(`case was published at ${publishedCase.publishedAt}`);

	return mapDateStringToUnixTimestamp(String(publishedCase?.publishedAt));
};

/**
 *
 * @param {number} id
 * @param {{subSector?: boolean, sector?: boolean, applicationDetails?: boolean, zoomLevel?: boolean, regions?: boolean, caseStatus?: boolean, serviceCustomer?: boolean, serviceCustomerAddress?: boolean, gridReference?: boolean}} inclusions
 * @returns {PrismaPromise<import('@pins/api').Schema.Case | null>}
 */
export const getById = (
	id,
	{
		subSector = false,
		sector = false,
		applicationDetails = false,
		zoomLevel = false,
		regions = false,
		caseStatus = false,
		serviceCustomer = false,
		serviceCustomerAddress = false,
		gridReference = false
	}
) => {
	return databaseConnector.case.findUnique({
		where: { id },
		...((applicationDetails ||
			subSector ||
			sector ||
			zoomLevel ||
			regions ||
			caseStatus ||
			serviceCustomer ||
			serviceCustomerAddress) && {
			include: {
				...((applicationDetails || subSector || zoomLevel || regions || sector) && {
					ApplicationDetails: {
						include: {
							...((sector || subSector) && {
								subSector: sector ? { include: { sector: true } } : true
							}),
							zoomLevel,
							...(regions && { regions: { include: { region: true } } })
						}
					}
				}),
				...(caseStatus && { CaseStatus: { where: { valid: true } } }),
				...((serviceCustomer || serviceCustomerAddress) && {
					serviceCustomer: { include: { address: serviceCustomerAddress } }
				}),
				...(gridReference && { gridReference: true })
			}
		})
	});
};
/**
 *
 * @param {number[]} ids
 * @returns {PrismaPromise<import('@pins/api').Schema.BatchPayload>}
 */
export const invalidateCaseStatuses = (ids) => {
	return databaseConnector.caseStatus.updateMany({
		where: { id: { in: ids } },
		data: { valid: false }
	});
};

/**
 *
 * @param {number} id
 * @param {string} status
 * @returns {PrismaPromise<import('@pins/api').Schema.BatchPayload>}
 */
export const createNewStatuses = (id, status) => {
	return isString(status)
		? databaseConnector.caseStatus.create({ data: { status, caseId: id } })
		: databaseConnector.caseStatus.createMany({ data: status });
};

/**
 *
 * @param {number} id
 * @param {{status: string | object, data: {regionNames?: string[]}, currentStatuses: object[], setReference: boolean}} updateData
 * @param {PrismaPromise<any>[]} additionalTransactions
 * @returns {any}
 */
export const updateApplicationStatusAndDataById = (
	id,
	{ status, data, currentStatuses, setReference = false },
	additionalTransactions
) => {
	const { caseStatesToInvalidate, caseStatesToCreate } = separateStatusesToSaveAndInvalidate(
		status,
		currentStatuses
	);

	/** @type {PrismaPromise<any>[]} */ const transactions = [
		invalidateCaseStatuses(caseStatesToInvalidate),
		createNewStatuses(id, caseStatesToCreate)
	];

	if (typeof data.regionNames !== 'undefined') {
		transactions.push(removeRegions(id));
	}

	if (!isEmpty(data)) {
		transactions.push(updateApplicationSansRegionsRemoval({ caseId: id, ...data }));
	}

	if (setReference) {
		transactions.push(assignApplicationReference(id));
	}

	transactions.push(...additionalTransactions);

	return databaseConnector.$transaction(transactions);
};

/**
 * @returns {string}
 */
const getCurrentDirectory = () => {
	return path.dirname(url.fileURLToPath(import.meta.url));
};

/**
 *
 * @param {string} queryFileName
 * @returns {string}
 */
const getSqlQuery = (queryFileName) => {
	const currentDirectory = getCurrentDirectory();

	return `${currentDirectory}/raw_sql_queries/${queryFileName}.sql`;
};

/**
 *
 * @param {string} inputString
 * @param {Object<string, string>} keysToReplace
 * @returns {string}
 */
const replaceValueInString = (inputString, keysToReplace) => {
	let formattedString = inputString;

	forEach(keysToReplace, (value, key) => {
		formattedString = formattedString.replace(key, value);
	});
	return formattedString;
};

/**
 *
 * @param {number} id
 * @returns {PrismaPromise<any>}
 */
export const assignApplicationReference = (id) => {
	const sqlQueryAbsolutePath = getSqlQuery('update-application-reference');

	const data = fs.readFileSync(sqlQueryAbsolutePath, 'utf8').replace(/\r|\n/g, '');

	const formattedSqlQuery = replaceValueInString(data, { CASE_ID: id.toString() });

	return databaseConnector.$executeRawUnsafe(formattedSqlQuery);
};
