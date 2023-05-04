import { Prisma } from '@prisma/client';
import { filter, includes, isString, map } from 'lodash-es';
import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

/**
 * @typedef {object} AppealInclusionOptions
 * @property {boolean=} address
 * @property {boolean=} appealDetailsFromAppellant
 * @property {boolean=} appellant
 * @property {boolean=} inspectorDecision
 * @property {boolean=} lpaQuestionnaire
 * @property {boolean=} latestLPAReviewQuestionnaire
 * @property {boolean=} siteVisit
 * @property {boolean=} validationDecision
 */

const includeLatestReviewQuestionnaireFilter = {
	reviewQuestionnaire: {
		take: 1,
		orderBy: {
			createdAt: 'desc'
		}
	}
};

const separateStatusesToSaveAndInvalidate = (newStatuses, currentStatuses) => {
	if (isString(newStatuses) || isString(currentStatuses)) {
		const appealStateIdsToInvalidate = map(currentStatuses, 'id');

		return {
			appealStatesToInvalidate: appealStateIdsToInvalidate,
			appealStatesToCreate: newStatuses
		};
	}

	const newStates = map(newStatuses, 'status');
	const oldStates = map(currentStatuses, 'status');
	const appealStateIdsToInvalidate = map(
		filter(currentStatuses, (currentState) => {
			return !includes(newStates, currentState.status);
		}),
		'id'
	);
	const newStatesToCreate = filter(newStatuses, (newStatus) => {
		return !includes(oldStates, newStatus.status);
	});

	return {
		appealStatesToInvalidate: appealStateIdsToInvalidate,
		appealStatesToCreate: newStatesToCreate
	};
};

const appealRepository = (function () {
	return {
		/**
		 * @param {number} pageNumber
		 * @param {number} pageSize
		 * @returns {Prisma.PrismaPromise<import('@pins/api').Schema.Appeal[]>}
		 */
		getAll(pageNumber, pageSize) {
			return databaseConnector.appeal.findMany({
				where: {
					appealStatus: {
						some: {
							valid: true
						}
					}
				},
				include: {
					address: true,
					appealType: true,
					appealStatus: {
						where: {
							valid: true
						}
					}
				},
				skip: getSkipValue(pageNumber, pageSize),
				take: pageSize
			});
		},
		/**
		 *
		 * @param {{statuses: string[], includeAddress: boolean, includeAppellant: boolean, includeLPAQuestionnaire: boolean, includeAppealDetailsFromAppellant: boolean}} param0
		 * @returns {Promise<import('@pins/api').Schema.Appeal[]>}
		 */
		getByStatuses({
			statuses,
			includeAddress = false,
			includeAppellant = false,
			includeLPAQuestionnaire = false,
			includeAppealDetailsFromAppellant = false
		}) {
			return databaseConnector.appeal.findMany({
				where: {
					appealStatus: {
						some: {
							status: {
								in: statuses
							},
							valid: true
						}
					}
				},
				include: {
					address: includeAddress,
					appellant: includeAppellant,
					lpaQuestionnaire: includeLPAQuestionnaire,
					appealDetailsFromAppellant: includeAppealDetailsFromAppellant,
					appealStatus: {
						where: {
							valid: true
						}
					}
				}
			});
		},
		/**
		 * Query an appeal by its id, including any optional relations.
		 *
		 * @param {number} id
		 * @param {AppealInclusionOptions} [inclusions={}]
		 * @returns {Prisma.PrismaPromise<import('@pins/api').Schema.Appeal | null>}
		 */
		getById(id, { latestLPAReviewQuestionnaire, ...inclusions } = {}) {
			return databaseConnector.appeal.findUnique({
				where: {
					id
				},
				include: {
					...inclusions,
					...(latestLPAReviewQuestionnaire && includeLatestReviewQuestionnaireFilter),
					appealDetailsFromAppellant: true,
					siteVisit: true,
					appellant: true,
					address: true,
					inspectorDecision: true,
					appealStatus: {
						where: {
							valid: true
						}
					},
					appealType: true
				}
			});
		},
		invalidateAppealStatuses(ids) {
			return databaseConnector.appealStatus.updateMany({
				where: { id: { in: ids } },
				data: { valid: false }
			});
		},
		createNewStatuses(id, status) {
			return isString(status)
				? databaseConnector.appealStatus.create({ data: { status, appealId: id } })
				: databaseConnector.appealStatus.createMany({ data: status });
		},
		updateStatusById(id, status, currentStates) {
			const { appealStatesToInvalidate, appealStatesToCreate } =
				separateStatusesToSaveAndInvalidate(status, currentStates);

			return databaseConnector.$transaction([
				this.invalidateAppealStatuses(appealStatesToInvalidate),
				this.createNewStatuses(id, appealStatesToCreate)
			]);
		},
		updateById(id, data) {
			const updatedAt = new Date();

			return databaseConnector.appeal.update({
				where: { id },
				data: { updatedAt, ...data }
			});
		},
		updateStatusAndDataById(id, status, data, currentStates) {
			const { appealStatesToInvalidate, appealStatesToCreate } =
				separateStatusesToSaveAndInvalidate(status, currentStates);

			return databaseConnector.$transaction([
				this.invalidateAppealStatuses(appealStatesToInvalidate),
				this.createNewStatuses(id, appealStatesToCreate),
				this.updateById(id, data)
			]);
		},
		getByStatusAndLessThanStatusUpdatedAtDate(status, lessThanStatusUpdatedAt) {
			return databaseConnector.appeal.findMany({
				where: {
					appealStatus: {
						some: {
							status,
							valid: true,
							createdAt: {
								lt: lessThanStatusUpdatedAt
							}
						}
					}
				},
				include: {
					appealType: true,
					appealStatus: {
						where: {
							valid: true
						}
					}
				}
			});
		},
		getByStatusAndInspectionBeforeDate(status, lessThanInspectionDate) {
			return databaseConnector.appeal.findMany({
				where: {
					appealStatus: {
						some: {
							status,
							valid: true
						}
					},
					siteVisit: {
						visitDate: {
							lt: lessThanInspectionDate
						}
					}
				},
				include: {
					appealType: true
				}
			});
		},
		getByStatusesAndUserId(statuses, userId) {
			return databaseConnector.appeal.findMany({
				where: {
					appealStatus: {
						some: {
							status: {
								in: statuses
							},
							valid: true
						}
					},
					user: {
						azureReference: userId
					}
				},
				include: {
					appealType: true,
					address: true,
					siteVisit: true,
					lpaQuestionnaire: true,
					appealDetailsFromAppellant: true,
					appellant: true,
					appealStatus: {
						where: {
							valid: true
						}
					}
				}
			});
		}
	};
}());

export default appealRepository;
