import { migrateS51AdviceForCase } from './s51-advice-migration.js';
import { ODW_GENERAL_S51_CASE_REF } from '@pins/applications';

/**
 * @param {import('@azure/functions').Logger} logger
 */
export const migrateGeneralS51Advice = async (logger) => {
	try {
		logger.info('Migrating all General S51 Advice: ');
		return migrateS51AdviceForCase(logger, ODW_GENERAL_S51_CASE_REF);
	} catch (error) {
		logger.error(`Error occurred during GeneralS51 Advice migration`, error);
		throw error;
	}
};
