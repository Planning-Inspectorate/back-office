import { isEmpty } from 'lodash-es';
import { databaseConnector } from '../utils/database-connector.js';

const DEFAULT_CASE_CREATE_STATUS = 'draft';

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
 *  caseDetails?: import('@pins/api').Schema.Case,
 * 	gridReference?: import('@pins/api').Schema.GridReference,
 *  application?: import('@pins/api').Schema.ApplicationDetails,
 *  mapZoomLevelName?: string,
 *  subSectorName?: string,
 *  applicant?: import('@pins/api').Schema.ServiceCustomer,
 *  applicantAddress?: import('@pins/api').Schema.Address}} caseInfo
 * @returns {Promise<import('@pins/api').Schema.Case>}
 */
export const createApplication = ({
	caseDetails,
	gridReference,
	application,
	mapZoomLevelName,
	subSectorName,
	applicant,
	applicantAddress
}) => {
	return databaseConnector.case.create({
		data: {
			...caseDetails,
			...(!isEmpty(gridReference) && { gridReference: { create: gridReference } }),
			...((!isEmpty(application) || subSectorName || mapZoomLevelName) && {
				ApplicationDetails: {
					create: {
						...application,
						...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
						...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } })
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
		}
	});
};

/**
 * @param {{
 *  caseId: number,
 *  applicantId?: number,
 *  caseDetails?: import('@pins/api').Schema.Case,
 * 	gridReference?: import('@pins/api').Schema.GridReference,
 *  application?: import('@pins/api').Schema.ApplicationDetails,
 *  subSectorName?: string,
 *  mapZoomLevelName?: string,
 *  applicant?: import('@pins/api').Schema.ServiceCustomer,
 *  applicantAddress?: import('@pins/api').Schema.Address}} caseInfo
 * @returns {Promise<import('@pins/api').Schema.Case>}
 */
export const updateApplication = ({
	caseId,
	applicantId,
	caseDetails,
	gridReference,
	application,
	subSectorName,
	mapZoomLevelName,
	applicant,
	applicantAddress
}) => {
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
			...((!isEmpty(application) || subSectorName || mapZoomLevelName) && {
				ApplicationDetails: {
					upsert: {
						create: {
							...application,
							...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
							...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } })
						},
						update: {
							...application,
							...(subSectorName && { subSector: { connect: { name: subSectorName } } }),
							...(mapZoomLevelName && { zoomLevel: { connect: { name: mapZoomLevelName } } })
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
		}
	});
};

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/api').Schema.Case | null>}
 */
export const getById = (id) => {
	return databaseConnector.case.findUnique({ where: { id } });
};
