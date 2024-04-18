import { QueryTypes } from 'sequelize';
import { SynapseDB } from '../synapse-db.js';
import { migrateS51AdviceForCase } from './s51-advice-migration.js';
import { ODW_GENERAL_S51_CASE_REF } from '@pins/applications';

/**
 * @param {import('@azure/functions').Logger} logger
 * @param {number} offset
 */
export const migrateGeneralS51Advice = async (logger, offset = 0) => {
	const countQuery = `
		SELECT COUNT(*) AS generalS51AdviceCount
		FROM [odw_curated_db].[dbo].[nsip_s51_advice]
		WHERE caseReference = '${ODW_GENERAL_S51_CASE_REF}';
	`;
	const [{ generalS51AdviceCount }] = await SynapseDB.query(countQuery, {
		type: QueryTypes.SELECT
	});
	logger.info(`Number of General S51 Advice found in odw_curated_db: ${generalS51AdviceCount}`);

	const batchSize = 100;
	while (offset < generalS51AdviceCount) {
		const paginatedGeneralS51AdviceQuery = `
			SELECT * FROM [odw_curated_db].[dbo].[nsip_s51_advice]
			WHERE caseReference = '${ODW_GENERAL_S51_CASE_REF}'
			ORDER BY nsip_s51_advice.adviceId
			OFFSET ${offset} ROWS
			FETCH NEXT ${batchSize} ROWS ONLY;
		`;

		try {
			await migrateS51AdviceForCase(
				logger,
				ODW_GENERAL_S51_CASE_REF,
				paginatedGeneralS51AdviceQuery
			);
		} catch (error) {
			logger.error(`Batch with offset ${offset} failed to migrate.`, error?.response?.body, error);
			throw error;
		}
		offset += batchSize;
	}
};

/**
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} adviceIdList
 */
export const migrateSelectGeneralS51Advice = async (logger, adviceIdList) => {
	for (const adviceId of adviceIdList) {
		const query = `
			SELECT * FROM [odw_curated_db].[dbo].[nsip_s51_advice]
			WHERE adviceId = '${adviceId}'
		`;
		await migrateS51AdviceForCase(logger, ODW_GENERAL_S51_CASE_REF, query);
	}
};
