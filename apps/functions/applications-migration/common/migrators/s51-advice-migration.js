import { SynapseDB } from '../synapse-db.js';
import { makePostRequestStreamResponse } from '../back-office-api-client.js';
import { pick } from 'lodash-es';
import { BO_GENERAL_S51_CASE_REF, ODW_GENERAL_S51_CASE_REF } from '@pins/applications';
import { valueToArray } from '../utils.js';

const query = 'SELECT * FROM [odw_curated_migration_db].[dbo].[s51_advice] WHERE caseReference = ?';

/**
 * Migrate s51-advice for a case
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} isGeneralS51Advice
 */
export const migrateS51AdviceForCase = async (log, caseReference, isGeneralS51Advice = false) => {
	try {
		log.info(`reading S51 Advice with caseReference ${caseReference}`);
		const { s51AdviceEntities, count } = await getNsipS51Advice(
			log,
			caseReference,
			isGeneralS51Advice
		);

		log.info(
			`found ${count} S51 Advice: ${JSON.stringify(s51AdviceEntities.map((u) => u.adviceId))}`
		);
		if (s51AdviceEntities.length > 0) {
			return makePostRequestStreamResponse(log, '/migration/s51-advice', s51AdviceEntities);
		}
	} catch (e) {
		throw new Error(`Failed to migrate S51 Advice for case ${caseReference}`, { cause: e });
	}
};

/**
 * Get S51 Advice for a case
 * @param {import('@azure/functions').Logger} log
 * @param {string} caseReference
 * @param {boolean} isGeneralS51Advice
 */
export const getNsipS51Advice = async (log, caseReference, isGeneralS51Advice = false) => {
	log.info(`Getting S51 Advice for case ${caseReference}`);

	const [s51AdviceRows, count] = await SynapseDB.query(query, {
		replacements: [caseReference]
	});

	const s51AdviceEntities = s51AdviceRows.map((row) => {
		if (isGeneralS51Advice && caseReference === ODW_GENERAL_S51_CASE_REF) {
			row.adviceReference = row.adviceReference.replace(
				ODW_GENERAL_S51_CASE_REF,
				BO_GENERAL_S51_CASE_REF
			);
			row.caseReference = BO_GENERAL_S51_CASE_REF;
		}
		return {
			...pick(row, [
				'adviceReference',
				'caseReference',
				'title',
				'from',
				'agent',
				'method',
				'enquiryDate',
				'adviceDate',
				'redactionStatus'
			]),
			adviceId: Number(row.adviceId),
			caseId: Number(row.caseId),
			status: mapStatus(row.status),
			attachmentIds: [...new Set(valueToArray(row.attachmentIds))], // deduplicate attachmentIds
			enquiryDetails: row.enquiryDetails ?? '',
			adviceDetails: row.adviceDetails ?? '',
			adviceGivenBy: row.adviceGivenBy ? row.adviceGivenBy : 'Not recorded in Horizon',
			datePublished: row.datepublished
		};
	});

	return { s51AdviceEntities, count };
};

/**
 *
 * @param {string} status
 * @returns {string|undefined}
 */
const mapStatus = (status) =>
	({
		checked: 'checked',
		unchecked: 'unchecked',
		'not checked': 'unchecked',
		'ready to publish': 'readytopublish',
		published: 'published',
		donotpublish: 'donotpublish',
		'do not publish': 'donotpublish',
		depublished: 'unchecked'
	}[status]);
