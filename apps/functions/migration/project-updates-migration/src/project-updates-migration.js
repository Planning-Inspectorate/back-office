export class ProjectUpdatesMigration {
	/** @type {import('@prisma/client').PrismaClient} */
	dbClient;

	/**
	 * @param {Object} opts
	 * @param {import('#db-client')} opts.dbClient
	 */
	constructor({ dbClient }) {
		this.dbClient = dbClient;
	}

	/**
	 * Handle an HTTP trigger/request to run the migration
	 *
	 * @param {import('@azure/functions').Context} context
	 * @param {import('@azure/functions').HttpRequest} req
	 */
	async handleRequest(context, req) {
		context.log.info('handleRequest', req);
		// todo: replace with actual logic!
		// for now just checking database connections and configuration
		// since we're using the prisma schema from api
		try {
			context.log.info('try back office database connection - list cases');
			context.log.info(
				await this.dbClient.case.findMany({
					take: 1
				})
			);
		} catch (e) {
			context.log.error(e);
		}
	}
}
