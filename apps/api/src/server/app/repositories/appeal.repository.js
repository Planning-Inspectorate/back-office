import DatabaseFactory from './database.js';

const includeLatestReviewQuestionnaireFilter = {
	reviewQuestionnaire: {
		take: 1,
		orderBy: {
			createdAt: 'desc'
		}
	}
};

const appealRepository = (function() {
	/**
	 * @returns {object} connection to database
	 */
	function getPool () {
		return DatabaseFactory.getInstance().pool;
	}
  
	return {
		getByStatuses: function (
			statuses, 
			includeAddress = false,
			includeAppellant = false
		) {
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
			includeAppellant = false,
			includeValidationDecision = false,
			includeAddress = false,
			includeLatestLPAReviewQuestionnaire = false,
			includeAppealDetailsFromAppellant = false,
			includeLpaQuestionnaire = false,
			includeSiteVisit = false
		) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					appellant: includeAppellant,
					validationDecision: includeValidationDecision,
					address: includeAddress,
					appealStatus: {
						where: {
							valid: true
						}
					},
					appealDetailsFromAppellant: includeAppealDetailsFromAppellant,
					lpaQuestionnaire: includeLpaQuestionnaire,
					...( includeLatestLPAReviewQuestionnaire && includeLatestReviewQuestionnaireFilter ),
					siteVisit: includeSiteVisit
				}
			});
		},
		invalidateAppealStatuses: function(id) {
			return getPool().appealStatus.updateMany({
				where: { appealId: id },
				data: { valid: false }
			});
		},
		createNewStatuses: function(id, status) {
			return getPool().appealStatus.create({
				data: {
					status: status,
					appealId: id
				}
			});
		},
		updateStatusById: function(id, status) {
			return getPool().$transaction([
				this.invalidateAppealStatuses(id),
				this.createNewStatuses(id, status)
			]);
		},
		updateById: function(id, data) {
			const updatedAt = new Date();
			return getPool().appeal.update({
				where: { id: id },
				data: { updatedAt: updatedAt, ...data }
			});
		},
		updateStatusAndDataById: function(id, status, data) {
			return getPool().$transaction([	
				this.invalidateAppealStatuses(id),
				this.createNewStatuses(id, status),
				this.updateById(id, data)
			]);
		},
		getByStatusAndLessThanStatusUpdatedAtDate: function(status, lessThanStatusUpdatedAt) {
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
		getByStatusAndInspectionBeforeDate: function(status, lessThanInspectionDate) {
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
		getByStatusesAndUserId: function(statuses, userId) {
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
