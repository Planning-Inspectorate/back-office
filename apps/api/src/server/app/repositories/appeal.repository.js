import { isString, map, filter, includes } from 'lodash-es';
import DatabaseFactory from './database.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

/**
 * @typedef {object} AppealInclusionOptions
 * @property {boolean=} address
 * @property {boolean=} appealDetailsFromAppellant
 * @property {boolean=} appellant
 * @property {boolean=} inspectorDecision
 * @property {boolean=} lpaQuestionnaire
 * @property {boolean=} latestLPAReviewQuestionnaire,
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

const separateStatusesToSaveAndInvalidate = function(newStatuses, currentStatuses) {
	if (isString(newStatuses) || isString(currentStatuses)) {
		const appealStateIdsToInvalidate = map(currentStatuses, 'id');
		return {
			appealStatesToInvalidate: appealStateIdsToInvalidate,
			appealStatesToCreate: newStatuses	
		};
	} else {
		const newStates = map(newStatuses, 'status');
		const oldStates = map(currentStatuses, 'status');
		const appealStateIdsToInvalidate = map(filter(currentStatuses, function (currentState) { return !includes(newStates, currentState.status) }), 'id');
		const newStatesToCreate = filter(newStatuses, function (newStatus) { return !includes(oldStates, newStatus.status) });
		return {
			appealStatesToInvalidate: appealStateIdsToInvalidate,
			appealStatesToCreate: newStatesToCreate
		};
	}
};

const appealRepository = (function () {
	/**
	 * @returns {object} connection to database
	 */
	function getPool() {
		return DatabaseFactory.getInstance().pool;
	}

	return {
		getByStatuses: function (
			statuses,
			includeAddress = false,
			includeAppellant = false,
			includeLPAQuestionnaire = false,
			includeAppealDetailsFromAppellant = false ) {
			return getPool().appeal.findMany({
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
		 * @template T [T=Appeal]
		 * @param {number} id
		 * @param {AppealInclusionOptions} [inclusions={}]
		 * @returns {Promise<T>}
		 */
		getById: function (id, { latestLPAReviewQuestionnaire, ...inclusions } = {}) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					...inclusions,
					...(latestLPAReviewQuestionnaire && includeLatestReviewQuestionnaireFilter),
					appealStatus: {
						where: {
							valid: true
						}
					},
					appealType: true
				}
			});
		},
		invalidateAppealStatuses: function (ids) {
			return getPool().appealStatus.updateMany({
				where: { id: { in: ids } },
				data: { valid: false }
			});
		},
		createNewStatuses: function(id, status) {
			return isString(status) ? getPool().appealStatus.create({
				data: {
					status: status,
					appealId: id
				}
			}) : getPool().appealStatus.createMany({ data: status });
		},
		updateStatusById: function (id, status, currentStates) {
			const { appealStatesToInvalidate, appealStatesToCreate } = separateStatusesToSaveAndInvalidate(status, currentStates);
			return getPool().$transaction([
				this.invalidateAppealStatuses(appealStatesToInvalidate), 
				this.createNewStatuses(id, appealStatesToCreate)
			]);
		},
		updateById: function (id, data) {
			const updatedAt = new Date();
			return getPool().appeal.update({
				where: { id: id },
				data: { updatedAt: updatedAt, ...data }
			});
		},
		updateStatusAndDataById: function (id, status, data, currentStates) {
			const { appealStatesToInvalidate, appealStatesToCreate } = separateStatusesToSaveAndInvalidate(status, currentStates);
			return getPool().$transaction([
				this.invalidateAppealStatuses(appealStatesToInvalidate), 
				this.createNewStatuses(id, appealStatesToCreate), 
				this.updateById(id, data)
			]);
		},
		getByStatusAndLessThanStatusUpdatedAtDate: function (status, lessThanStatusUpdatedAt) {
			return getPool().appeal.findMany({
				where: {
					appealStatus: {
						every: {
							status: status,
							valid: true,
							createdAt: {
								lt: lessThanStatusUpdatedAt
							}
						}
					}
				}
			});
		},
		getByStatusAndInspectionBeforeDate: function (status, lessThanInspectionDate) {
			return getPool().appeal.findMany({
				where: {
					appealStatus: {
						every: {
							status: status,
							valid: true
						}
					},
					siteVisit: {
						visitDate: {
							lt: lessThanInspectionDate
						}
					}
				}
			});
		},
		getByStatusesAndUserId: function (statuses, userId) {
			return getPool().appeal.findMany({
				where: {
					appealStatus: {
						some: {
							status: {
								in: statuses
							},
							valid: true
						}
					},
					userId: userId
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
})();

export default appealRepository;
