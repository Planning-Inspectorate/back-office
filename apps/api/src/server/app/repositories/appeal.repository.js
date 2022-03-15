import DatabaseFactory from './database.js';

var appealRepository = (function() {
	function getPool () {
	  return DatabaseFactory.getInstance().pool;
	}
  
	return {
		getAll: async function () {
			return await getPool().appeal.findMany();
		},
		getByStatuses: async function (statuses) {
			return await getPool().appeal.findMany({
				where: {
					status: {
						in: statuses
					}
				}
			});
		},
		getById: async function (id) {
			return await getPool().appeal.findUnique({
				where: {
					id: id
				}
			});
		}
	};
  })();

export default appealRepository;
