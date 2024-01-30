import { SynapseDB } from '../../common/synapse-db.js';
import { makePostRequest } from '../../common/back-office-api-client.js';
import { removeValues } from '../../common/utils.js';
import { pick } from 'lodash-es';

const query = 'SELECT * FROM [odw_curated_db].[dbo].[nsip_s51_advice] WHERE caseReference = ?';

const s51AdviceProperties = [
	'adviceId',
	'adviceReference',
	'caseId',
	'caseReference',
	'title',
	'from',
	'agent',
	'method',
	'enquiryDate',
	'enquiryDetails',
	'adviceGivenBy',
	'adviceDate',
	'adviceDetails',
	'status',
	'redactionStatus',
	'attachmentIds'
];

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string[]} caseReferences
 */
export const migrateS51Advice = async (logger, caseReferences) => {
	for (const caseReference of caseReferences) {
		try {
			logger.info(`reading S51 Advice with caseReference ${caseReference}`);

			const [s51AdviceRows, count] = await SynapseDB.query(query, {
				replacements: [caseReference]
			});

			const s51AdviceEntities = s51AdviceRows.map((row) => {
				removeValues(row, [null, 'None']);

				return {
					...pick(row, s51AdviceProperties),
					status: mapStatus(row.status),
					attachmentIds: row.attachmentIds?.split(',')
				};
			});

			logger.info(
				`found ${count} S51 Advice: ${JSON.stringify(s51AdviceEntities.map((u) => u.adviceId))}`
			);

			if (s51AdviceEntities.length > 0) {
				await makePostRequest(logger, '/migration/s51-advice', s51AdviceEntities);
			}
		} catch (e) {
			logger.error(`Failed to migrate S51 Advice for case ${caseReference}`, e?.response?.body, e);
			throw e;
		}
	}
};

const mapStatus = (status) =>
	({
		checked: 'checked',
		'not checked': 'unchecked',
		'ready to publish': 'readytopublish',
		published: 'published',
		'do not publish': 'donotpublish',
		depublished: 'unchecked'
	}[status]);
