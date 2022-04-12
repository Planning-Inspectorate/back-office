import DatabaseFactory from './database.js';

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
		getByStatuses: function (statuses) {
			return getPool().appeal.findMany({
				where: {
					status: {
						in: statuses
					}
				}
			});
		},
		getByStatusesWithAddresses: function (statuses) {
			return getPool().appeal.findMany({
				where: {
					status: {
						in: statuses
					}
				},
				include: {
					address: true,
					appellant: true
				}
			});
		},
		getById: function (id) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					appellant: true
				}
			});
		},
		getByIdIncluding: function(id, including) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: including
			});
		},
		getByIdWithAddress: function(id) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					address: true,
					appellant: true
				}
			});
		},
		getByIdWithValidationDecision: function(id) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					validationDecision: true
				}
			});
		},
		getByIdWithValidationDecisionAndAddress: function(id) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				},
				include: {
					validationDecision: true,
					address: true,
					appellant: true
				}
			});
		},
		updateStatusById: function(id, status) {
			const updatedAt = new Date();
			return getPool().appeal.update({
				where: { id: id },
				data: { status: status, statusUpdatedAt: updatedAt, updatedAt: updatedAt }
			});
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
					status: status,
					statusUpdatedAt: {
						lt: lessThanStatusUpdatedAt
					}
				}
			});
		},
		getByStatusAndInspectionBeforeDate: function(status, lessThanInspectionDate) {
			return getPool().appeal.findMany({
				where: {
					status: status,
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
					status: {
						in: statuses
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
