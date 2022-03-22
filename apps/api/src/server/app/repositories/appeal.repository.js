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
		getById: function (id) {
			return getPool().appeal.findUnique({
				where: {
					id: id
				}
			});
		},
		updateStatusById: function(id, status) {
			return getPool().appeal.update({
				where: { id: id },
				data: { status: status }
			});
		}
	};
})();

export default appealRepository;
