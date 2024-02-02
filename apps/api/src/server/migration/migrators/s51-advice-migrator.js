/**
 * @typedef {import('pins-data-model').Schemas.S51Advice} S51AdviceModel
 * @typedef {import('apps/api/src/database/schema.d.ts').S51Advice} S51Advice
 */

import { getCaseIdFromRef } from './utils.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { databaseConnector } from '#utils/database-connector.js';

/**
 * @param {S51AdviceModel[]} s51AdviceList
 */
export const migrateS51Advice = async (s51AdviceList) => {
	console.info(`Migrating ${s51AdviceList.length} S51 Advice items`);

	for (const s51Advice of s51AdviceList) {
		const s51AdviceEntity = await mapModelToS51AdviceEntity(s51Advice);

		if (s51AdviceEntity.id >= MigratedEntityIdCeiling) {
			throw Error(`Unable to migrate entity id=${s51AdviceEntity.id} - identity above threshold`);
		}

		const { statement: s51AdviceStatement, parameters: s51AdviceParameters } = buildUpsertForEntity(
			'S51Advice',
			s51AdviceEntity,
			'id'
		);

		console.info(`Upserting S51Advice with ID ${s51AdviceEntity.id}`);

		await databaseConnector.$transaction([
			databaseConnector.$executeRawUnsafe(s51AdviceStatement, ...s51AdviceParameters)
		]);

		// TODO attachments
		// for (const attachmentId in s51AdviceEntity.attachmentIds) {
		// 	// create attachment/document
		// }
	}
};

/**
 * @param {S51AdviceModel} s51Advice
 * @returns {S51Advice}
 */
const mapModelToS51AdviceEntity = async ({
	adviceId,
	adviceReference,
	// caseId,
	caseReference,
	title,
	from,
	// agent,
	method,
	enquiryDate,
	enquiryDetails,
	adviceGivenBy,
	adviceDate,
	adviceDetails,
	status,
	redactionStatus
	// attachmentIds
}) => {
	let firstName, lastName;
	if (from) {
		let otherNames;
		[firstName, ...otherNames] = from.split(' ');
		lastName = otherNames.join(' ');
	}
	const referenceNumber = parseAdviceReference(adviceReference);

	const caseId = await getCaseIdFromRef(caseReference);
	if (!caseId) throw Error(`Case does not exist for caseReference ${caseReference}`);

	return {
		id: Number(adviceId),
		caseId: caseId,
		title: title || '',
		firstName,
		lastName,
		enquiryMethod: method || '',
		enquiryDate: enquiryDate || new Date(0),
		enquiryDetails: enquiryDetails || '',
		adviser: adviceGivenBy || '',
		adviceDate: adviceDate || new Date(0),
		adviceDetails: adviceDetails || '',
		publishedStatus: mapStatus(status),
		redactedStatus: redactionStatus,
		referenceNumber
	};
};

const parseAdviceReference = (adviceReference) => {
	const match = adviceReference.match(/\d+$/);
	return match ? Number(match[0]) : 1;
};

const mapStatus = (status) =>
	({
		checked: 'checked',
		unchecked: 'not_checked',
		readytopublish: 'ready_to_publish',
		published: 'published',
		donotpublish: 'do_not_publish',
		depublished: 'not_checked'
	}[status]);
