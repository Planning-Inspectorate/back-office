import { BO_GENERAL_S51_CASE_REF } from '@pins/applications';
import { forEach, isEmpty, isString, map } from 'lodash-es';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { databaseConnector } from '#utils/database-connector.js';
import { separateStatusesToSaveAndInvalidate } from './separate-statuses-to-save-and-invalidate.js';
import { featureFlagClient } from '#utils/feature-flags.js';
import { getSearchTermArrayExcludingStopWords } from '#utils/stop-words.js';
import logger from '#utils/logger.js';

const DEFAULT_CASE_CREATE_STATUS = 'draft';

const includeAll = {
	ApplicationDetails: {
		include: {
			subSector: { include: { sector: true } },
			zoomLevel: true,
			regions: { include: { region: true } }
		}
	},
	CaseStatus: { where: { valid: true } },
	gridReference: true,
	applicant: { include: { address: true } }
};

// where clause to exclude the General S51 Advice case
export const whereNotGeneralS51AdviceCase = {
	OR: [
		{
			reference: {
				not: BO_GENERAL_S51_CASE_REF
			}
		},
		{
			reference: null
		}
	]
};

// where clause to exclude TRAINING cases unless the feature flag is active
export const buildTrainingCasesWhereClause = () => {
	let whereTrainingClause = {};
	let dontIncludeTrainingCases = true;
	logger.info('Checking for applics-1036-training-sector Feature Flag');
	try {
		if (featureFlagClient) {
			dontIncludeTrainingCases = featureFlagClient.isFeatureActive('applics-1036-training-sector');
			logger.info(
				'Checking for applics-1036-training-sector Feature Flag - result: ',
				featureFlagClient.isFeatureActive('applics-1036-training-sector')
			);
		} else {
			logger.info('Checking for applics-1036-training-sector Feature Flag - not available');
		}
	} catch (error) {
		// If the feature flag client is not available, default to excluding training cases
		logger.info('Checking for applics-1036-training-sector Feature Flag - error', error);
	}

	if (dontIncludeTrainingCases) {
		logger.info('Excluding training cases from query');
		whereTrainingClause = {
			OR: [
				{
					reference: {
						not: {
							startsWith: 'TRAIN'
						}
					}
				},
				{
					reference: null
				}
			]
		};
	}
	return whereTrainingClause;
};

/**
 * @typedef {{
 *  caseDetails?: { title?: string | null, description?: string | null },
 * 	gridReference?: { easting?: number | null, northing?: number | null },
 *  applicationDetails?: { locationDescription?: string | null, submissionAtInternal?: Date | null, submissionAtPublished?: string | null, caseEmail?: string | null, dateOfReOpenRelevantRepresentationStart?: Date | null, dateOfReOpenRelevantRepresentationClose?: Date | null },
 *  caseStatus?: { status: import('@pins/applications').ApplicationStageType },
 *  subSectorName?: string | null,
 *  applicant?: { organisationName?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, email?: string | null, website?: string | null, phoneNumber?: string | null},
 *  mapZoomLevelName?: string | null,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} CommonCaseParams
 */

/** @typedef {CommonCaseParams} CreateApplicationParams */

/**
 * @typedef {CommonCaseParams & { caseId: number, applicantId?: number, hasUnpublishedChanges?: boolean, isMaterialChange?: boolean }} UpdateApplicationParams
 * */

/**
 * @param {string[]} statusArray
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.Case[]>}
 */
export const getByStatus = (statusArray) => {
	return databaseConnector.case.findMany({
		orderBy: [{ ApplicationDetails: { subSector: { abbreviation: 'asc' } } }],
		where: {
			AND: [
				whereNotGeneralS51AdviceCase,
				buildTrainingCasesWhereClause(),
				{
					CaseStatus: {
						some: {
							status: {
								in: statusArray
							},
							valid: true
						}
					}
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
 * @param {number} skipValue
 * @param {number} pageSize
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.Case[]>}
 */
export const getBySearchCriteria = (query, skipValue, pageSize) => {
	const terms = getSearchTermArrayExcludingStopWords(query);
	return databaseConnector.case.findMany({
		skip: skipValue,
		take: pageSize,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			AND: [
				whereNotGeneralS51AdviceCase,
				buildTrainingCasesWhereClause(),
				{
					OR: [
						{
							AND: terms.map((term) => ({
								title: { contains: term }
							}))
						},
						{
							AND: terms.map((term) => ({
								reference: { contains: term }
							}))
						},
						{
							AND: terms.map((term) => ({
								description: { contains: term }
							}))
						}
					]
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
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getApplicationsCountBySearchCriteria = (query) => {
	const terms = getSearchTermArrayExcludingStopWords(query);
	return databaseConnector.case.count({
		where: {
			AND: [
				whereNotGeneralS51AdviceCase,
				buildTrainingCasesWhereClause(),
				{
					OR: [
						{
							AND: terms.map((term) => ({
								title: { contains: term }
							}))
						},
						{
							AND: terms.map((term) => ({
								reference: { contains: term }
							}))
						},
						{
							AND: terms.map((term) => ({
								description: { contains: term }
							}))
						}
					]
				}
			]
		}
	});
};

/**
 * @param {CreateApplicationParams} caseInfo
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.Case>}
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
				applicant: {
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
		include: includeAll
	});
};

/**
 * Removes all 'regions on a case' records from the regionsOnApplicationDetails table.
 * used eg when updating regions selected on a case.
 * The applicationDetailsId is passed in - which may not necessarily be the caseId
 *
 * @param {number} applicationDetailsId
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.BatchPayload>}
 */
const removeRegions = (applicationDetailsId) => {
	return databaseConnector.regionsOnApplicationDetails.deleteMany({
		where: { applicationDetailsId }
	});
};

/**
 * @param {UpdateApplicationParams} data
 * @returns {Promise<import('@pins/applications.api').Schema.Case>}
 */
const updateApplicationSansRegionsRemoval = async ({
	caseId,
	applicantId,
	caseDetails,
	gridReference,
	applicationDetails,
	caseStatus,
	subSectorName,
	regionNames,
	mapZoomLevelName,
	applicant,
	applicantAddress,
	hasUnpublishedChanges,
	isMaterialChange
}) => {
	const formattedRegionNames = map(regionNames, (/** @type {string} */ regionName) => {
		return { region: { connect: { name: regionName } } };
	});

	// Check if an applicant has to be created or updated
	if (!isEmpty(applicant) || !isEmpty(applicantAddress)) {
		if (applicantId) {
			// If an applicationId is explicitly provided, this is an update
			await databaseConnector.serviceUser.update({
				data: {
					...applicant,
					...(!isEmpty(applicantAddress) && {
						address: { upsert: { create: applicantAddress, update: applicantAddress } }
					})
				},
				where: {
					id: applicantId
				}
			});
		} else {
			// If an applicationId is not provided, we're creating a new applicant
			const createdServiceUser = await databaseConnector.serviceUser.create({
				data: {
					...applicant,
					...(!isEmpty(applicantAddress) && {
						address: { create: applicantAddress }
					})
				}
			});

			applicantId = createdServiceUser.id;
		}
	}

	return await databaseConnector.case.update({
		where: { id: caseId },
		data: {
			modifiedAt: new Date(),
			...caseDetails,
			...(applicantId && {
				applicantId
			}),
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
			...(caseStatus && {
				CaseStatus: {
					updateMany: {
						data: { valid: false },
						where: { caseId }
					},
					create: {
						...caseStatus,
						valid: true
					}
				}
			}),
			...(hasUnpublishedChanges !== undefined ? { hasUnpublishedChanges } : {}),
			...(isMaterialChange !== undefined ? { isMaterialChange } : {})
		},
		include: {
			applicant: true
		}
	});
};

/**
 * @param {UpdateApplicationParams} caseInfo
 * @returns {Promise<import('@pins/applications.api').Schema.Case | null>}
 */
export const updateApplication = async ({
	caseId,
	applicantId,
	caseDetails,
	gridReference,
	applicationDetails,
	caseStatus,
	subSectorName,
	regionNames,
	mapZoomLevelName,
	applicant,
	applicantAddress,
	hasUnpublishedChanges,
	isMaterialChange
}) => {
	if (typeof regionNames !== 'undefined') {
		// get the correct ApplicationDetails record id corresponding to this case
		const applicationDetailsRecord = await databaseConnector.applicationDetails.findUnique({
			where: { caseId }
		});

		if (applicationDetailsRecord) {
			await removeRegions(applicationDetailsRecord.id);
		}
	}

	await updateApplicationSansRegionsRemoval({
		caseId,
		applicantId,
		caseDetails,
		gridReference,
		applicationDetails,
		caseStatus,
		subSectorName,
		regionNames,
		mapZoomLevelName,
		applicant,
		applicantAddress,
		hasUnpublishedChanges,
		isMaterialChange
	});

	return getById(caseId, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		casePublishedState: true,
		applicant: true,
		gridReference: true,
		projectTeam: true
	});
};

/**
 * @param {{ caseId: number }} _
 * @returns {Promise<import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.Case | null>>}
 */
export const publishCase = async ({ caseId }) => {
	await databaseConnector.case.update({
		where: { id: caseId },
		data: {
			hasUnpublishedChanges: false,
			CasePublishedState: {
				create: {
					isPublished: true
				}
			}
		}
	});

	return getById(caseId, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		casePublishedState: true,
		applicant: true,
		gridReference: true,
		projectTeam: true
	});
};

/**
 * @param {{ caseId: number }} _
 * @returns {Promise<import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.Case | null>>}
 */
export const unpublishCase = async ({ caseId }) => {
	await databaseConnector.case.update({
		where: { id: caseId },
		data: {
			CasePublishedState: {
				create: {
					isPublished: false
				}
			}
		}
	});

	return getById(caseId, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		casePublishedState: true,
		applicant: true,
		gridReference: true,
		projectTeam: true
	});
};

/**
 *
 * @param {number} id
 * @param {{subSector?: boolean, sector?: boolean, applicationDetails?: boolean, zoomLevel?: boolean, regions?: boolean, caseStatus?: boolean, casePublishedState?: boolean, applicant?: boolean, gridReference?: boolean, projectTeam?: boolean}} inclusions
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.Case | null>}
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
		casePublishedState = false,
		applicant = false,
		gridReference = false,
		projectTeam = false
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
			casePublishedState ||
			applicant ||
			projectTeam) && {
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
				...(casePublishedState && { CasePublishedState: { orderBy: { createdAt: 'desc' } } }),
				...(applicant && {
					applicant: { include: { address: true } }
				}),
				...(gridReference && { gridReference: true }),
				...(projectTeam && { ProjectTeam: { orderBy: { createdAt: 'desc' } } })
			}
		})
	});
};

/**
 * @param {string} reference
 * @returns {import('@prisma/client').PrismaPromise<import('@prisma/client').Case | null>}
 * */
export const getByRef = (reference) => {
	return databaseConnector.case.findFirst({
		where: { reference }
	});
};

/**
 *
 * @param {number[]} ids
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.BatchPayload>}
 */
const invalidateCaseStatuses = (ids) => {
	return databaseConnector.caseStatus.updateMany({
		where: { id: { in: ids } },
		data: { valid: false }
	});
};

/**
 *
 * @param {number} id
 * @param {string} status
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.BatchPayload>}
 */
const createNewStatuses = (id, status) => {
	return isString(status)
		? databaseConnector.caseStatus.create({ data: { status, caseId: id } })
		: databaseConnector.caseStatus.createMany({ data: status });
};

/**
 *
 * @param {number} id
 * @param {number |undefined} applicationDetailsId
 * @param {{status: string | object, data: {regionNames?: string[]}, currentStatuses: object[], setReference: boolean}} updateData
 * @param {import('@prisma/client').PrismaPromise<any>[]} additionalTransactions
 * @returns {Promise<import('@pins/applications.api').Schema.Case | null>}
 */
export const updateApplicationStatusAndDataById = async (
	id,
	applicationDetailsId,
	{ status, data, currentStatuses, setReference = false },
	additionalTransactions
) => {
	const { caseStatesToInvalidate, caseStatesToCreate } = separateStatusesToSaveAndInvalidate(
		status,
		currentStatuses
	);

	/** @type {import('@prisma/client').PrismaPromise<any>[]} */ const transactions = [
		invalidateCaseStatuses(caseStatesToInvalidate),
		createNewStatuses(id, caseStatesToCreate)
	];

	if (typeof data.regionNames !== 'undefined' && applicationDetailsId) {
		transactions.push(removeRegions(applicationDetailsId));
	}

	if (!isEmpty(data)) {
		transactions.push(updateApplicationSansRegionsRemoval({ caseId: id, ...data }));
	}

	if (setReference) {
		transactions.push(assignApplicationReference(id));
	}

	transactions.push(...additionalTransactions);

	await databaseConnector.$transaction(transactions);

	return getById(id, {
		subSector: true,
		sector: true,
		applicationDetails: true,
		zoomLevel: true,
		regions: true,
		caseStatus: true,
		casePublishedState: true,
		applicant: true,
		gridReference: true,
		projectTeam: true
	});
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
 * @returns {import('@prisma/client').PrismaPromise<any>}
 */
const assignApplicationReference = (id) => {
	const sqlQueryAbsolutePath = getSqlQuery('update-application-reference');

	// remove new lines from the sql script - but replace with a space.
	// otherwise, if there are not spaces on the end of each line, then the wordswillallruntogether
	const data = fs.readFileSync(sqlQueryAbsolutePath, 'utf8').replace(/\r|\n/g, ' ');

	const formattedSqlQuery = replaceValueInString(data, { CASE_ID: id.toString() });

	return databaseConnector.$executeRawUnsafe(formattedSqlQuery);
};
