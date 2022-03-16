import DatabaseFactory from './database.js';

const addressRepository = {
	getById: function (id) {
		const database = DatabaseFactory.getInstance();
		return database.pool.address.findUnique({
			where: {
				id: id
			}
		});
	}
};

export default addressRepository;
