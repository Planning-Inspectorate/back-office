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
		getAll: function () {
			return getPool().appeal.findMany();
		},
		getByStatuses: function (
			statuses, 
			includeAddress = false,
			includeAppellant = false
		) {
			return getPool().appeal.findMany({
				where: {
					appealStatus: {
						every: {
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
			includeLatestLPAReviewQuestionnaire = false
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
					...( includeLatestLPAReviewQuestionnaire && includeLatestReviewQuestionnaireFilter )
				}
			});
		},
		// getByIdIncluding: function(id, including) {
		// 	return getPool().appeal.findUnique({
		// 		where: {
		// 			id: id
		// 		},
		// 		include: including
		// 	});
		// },
		// getByIdWithAddress: function(id) {
		// 	return getPool().appeal.findUnique({
		// 		where: {
		// 			id: id
		// 		},
		// 		include: {
		// 			address: true,
		// 			appellant: true
		// 		}
		// 	});
		// },
		// getByIdWithValidationDecision: function(id) {
		// 	return getPool().appeal.findUnique({
		// 		where: {
		// 			id: id
		// 		},
		// 		include: {
		// 			validationDecision: true
		// 		}
		// 	});
		// },
		// getByIdWithValidationDecisionAndAddress: function(id) {
		// 	return getPool().appeal.findUnique({
		// 		where: {
		// 			id: id
		// 		},
		// 		include: {
		// 			validationDecision: true,
		// 			address: true,
		// 			appellant: true
		// 		}
		// 	});
		// },
		updateStatusById: function(id, status) {
			return getPool().$transaction([
				getPool().appealStatus.updateMany({
					where: { appealId: id },
					data: { valid: false }
				}),
				getPool().appealStatus.create({
					data: {
						status: status,
						appealId: id
					}
				})
			]);
		},
		updateById: function(id, data) {
			const updatedAt = new Date();
			return getPool().appeal.update({
				where: { id: id },
				data: { updatedAt: updatedAt, ...data }
			});
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
						every: {
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
					appellant: true
				}
			});
		}
	};
})();

export default appealRepository;
