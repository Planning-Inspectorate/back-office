import DatabaseFactory from './database.js';

const appealRepository = {
	getAll: async function () {
		const database = DatabaseFactory.getInstance();
		return await database.pool.appeal.findMany();
	},
	getByStatuses: async function (statuses) {
		const database = DatabaseFactory.getInstance();
		return await database.pool.appeal.findMany({
			where: {
				status: {
					in: statuses
				}
			}
		});
	}
};

export default appealRepository;
