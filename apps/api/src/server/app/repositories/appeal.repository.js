import DatabaseFactory from './database.js';

const appealRepository = {
	getAll: async function() {
		const database = DatabaseFactory.getInstance();
		return await database.pool.appeal.findMany();
	}
};

export default appealRepository;
