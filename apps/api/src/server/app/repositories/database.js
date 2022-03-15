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
		getInstance: function(){
			if (instance == undefined) {
				instance = new DatabaseClass();
				instance.constructor = undefined;
			}
			return instance;
		}
	};
})();

export default DatabaseFactory;
