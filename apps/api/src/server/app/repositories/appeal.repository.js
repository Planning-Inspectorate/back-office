import { isString } from 'lodash-es';
import DatabaseFactory from './database.js';

/** @typedef {keyof import('@pins/api').Schema.AppealRelations} AppealRelationType */

const includeLatestReviewQuestionnaireFilter = {
	reviewQuestionnaire: {
		take: 1,
		orderBy: {
			createdAt: 'desc'
		}
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
		/**
		 * Query an appeal by its id, including any optional relations.
		 *
		 * @param {number} id
		 * @param {Record<AppealRelationType, boolean>} include
		 * @returns {Promise<Appeal>}
		 */
		getByIdIncluding: function (id, include) {
			return getPool().appeal.findUnique({
				where: { id },
				include: {
					...include,
					appealStatus: {
						where: {
							valid: true
						}
					}
				}
			});
		},
		getByStatuses: function (statuses, includeAddress = false, includeAppellant = false) {
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
					lpaQuestionnaire: true,
					appealDetailsFromAppellant: true,
					appealStatus: {
						where: {
							valid: true
						}
					}
				}
			});
		},
		getById: function (
			id,
			inclusions = {}
		) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					...( inclusions.appellant && { appellant: inclusions.appellant }),
					...( inclusions.validationDecision && { validationDecision: inclusions.validationDecision }),
					...( inclusions.address && { address: inclusions.address }),
					...( inclusions.appealDetailsFromAppellant && { appealDetailsFromAppellant: inclusions.appealDetailsFromAppellant }),
					...( inclusions.lpaQuestionnaire && { lpaQuestionnaire: inclusions.lpaQuestionnaire }),
					...( inclusions.latestLPAReviewQuestionnaire && includeLatestReviewQuestionnaireFilter),
					appealStatus: {
						where: {
							valid: true
						}
					},
					appealType: true
				}
			});
		},
		invalidateAppealStatuses: function (id) {
			return getPool().appealStatus.updateMany({
				where: { appealId: id },
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
		updateStatusById: function (id, status) {
			return getPool().$transaction([this.invalidateAppealStatuses(id), this.createNewStatuses(id, status)]);
		},
		updateById: function (id, data) {
			const updatedAt = new Date();
			return getPool().appeal.update({
				where: { id: id },
				data: { updatedAt: updatedAt, ...data }
			});
		},
		updateStatusAndDataById: function (id, status, data) {
			return getPool().$transaction([this.invalidateAppealStatuses(id), this.createNewStatuses(id, status), this.updateById(id, data)]);
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
