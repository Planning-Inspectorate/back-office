import DatabaseFactory from './database.js';

const addressRepository = {
	getById: async function (id) {
		const database = DatabaseFactory.getInstance();
		return await database.pool.address.findUnique({
			where: {
				id: id
			}
		});
	}
};

export default addressRepository;
