import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

const DatabaseFactory = (function(){
	/**
	 *
	 */
	function DatabaseClass() {
		this.pool = new PrismaClient();
	}

	let instance;

	return {
		getInstance(){
			if (typeof(instance) === 'undefined') {
				instance = new DatabaseClass();
			}
			return instance;
		}
	};
}());

export default DatabaseFactory;
