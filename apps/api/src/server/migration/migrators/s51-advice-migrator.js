/**
 * @typedef {import('pins-data-model').Schemas.S51Advice} S51AdviceModel
 * @typedef {import('apps/api/src/database/schema.d.ts').S51Advice} S51Advice
 */

import { getCaseIdFromRef, sendChunkedEvents } from './utils.js';
import { MigratedEntityIdCeiling } from '../migrator.consts.js';
import { buildUpsertForEntity } from './sql-tools.js';
import { databaseConnector } from '#utils/database-connector.js';
import { EventType } from '@pins/event-client';
import { NSIP_S51_ADVICE } from '#infrastructure/topics.js';
import * as documentRepository from '#repositories/document.repository.js';
import * as s51AdviceDocumentRepository from '#repositories/s51-advice-document.repository.js';

/**
 * @param {S51AdviceModel[]} s51AdviceList
 */
export const migrateS51Advice = async (s51AdviceList) => {
	console.info(`Migrating ${s51AdviceList.length} S51 Advice items`);

	const promiseList = await Promise.allSettled(
		s51AdviceList.map(async (s51Advice) => {
			try {
				const s51AdviceEntity = await mapModelToS51AdviceEntity(s51Advice);

				if (s51AdviceEntity.id >= MigratedEntityIdCeiling) {
					throw Error(
						`Unable to migrate entity id=${s51AdviceEntity.id} - identity above threshold`
					);
				}

				const { statement: s51AdviceStatement, parameters: s51AdviceParameters } =
					buildUpsertForEntity('S51Advice', s51AdviceEntity, 'id');

				console.info(`Upserting S51Advice with ID ${s51AdviceEntity.id}`);

				await databaseConnector.$transaction([
					databaseConnector.$executeRawUnsafe(s51AdviceStatement, ...s51AdviceParameters)
				]);

				for await (const attachmentId of s51Advice.attachmentIds) {
					const documentRow = await documentRepository.getById(attachmentId);
					if (!documentRow || !documentRow.guid) {
						throw Error(`Failed to get document with ID ${attachmentId}`);
					}
					return s51AdviceDocumentRepository.upsertS51AdviceDocument(
						s51AdviceEntity.id,
						documentRow.guid
					);
				}
			} catch (error) {
				throw Error(`Failed to process S51Advice with ID ${s51Advice.adviceId}: ${error.message}`);
			}
		})
	);
	handleRejectedPromises(promiseList);

	const { publishEvents, updateEvents } = s51AdviceList.reduce(
		(memo, s51Advice) => {
			const { firstName, lastName } = generateNamesFromFromField(s51Advice.from);
			s51Advice.title = generateAdviceTitleForFo({
				enquiryMethod: s51Advice.method,
				enquirer: s51Advice.agent,
				firstName,
				lastName
			});
			s51Advice.status === 'published'
				? memo.publishEvents.push(s51Advice)
				: memo.updateEvents.push(s51Advice);

			return memo;
		},
		{
			publishEvents: [],
			updateEvents: []
		}
	);

	console.info(`Broadcasting ${updateEvents.length} S51 Advice UPDATE events`);
	await sendChunkedEvents(NSIP_S51_ADVICE, updateEvents, EventType.Update);

	console.info(`Broadcasting ${publishEvents.length} S51 Advice PUBLISH events`);
	await sendChunkedEvents(NSIP_S51_ADVICE, publishEvents, EventType.Publish);
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
	from,
	agent,
	method,
	enquiryDate,
	enquiryDetails,
	adviceGivenBy,
	adviceDate,
	adviceDetails,
	status,
	redactionStatus,
	datePublished
}) => {
	const { firstName, lastName } = generateNamesFromFromField(from);
	const referenceNumber = parseAdviceReference(adviceReference);

	const caseId = await getCaseIdFromRef(caseReference);
	if (!caseId) throw Error(`Case does not exist for caseReference ${caseReference}`);

	return {
		id: Number(adviceId),
		caseId: caseId,
		title: generateAdviceTitleForFo({
			enquiryMethod: method,
			enquirer: agent,
			firstName,
			lastName
		}),
		enquirer: agent,
		firstName,
		lastName,
		enquiryMethod: method || '',
		enquiryDate: enquiryDate || new Date(0),
		enquiryDetails: enquiryDetails || '',
		adviser: adviceGivenBy || '',
		adviceDate: adviceDate || new Date(0),
		adviceDetails: adviceDetails || '',
		publishedStatus: mapStatus(status),
		datePublished,
		redactedStatus: redactionStatus,
		referenceNumber
	};
};

const removeUnnecessarySpaces = (string) => {
	return string.replace(/\s+/g, ' ').trim();
};

const parseAdviceReference = (adviceReference) => {
	const match = adviceReference.match(/\d+$/);
	return match ? Number(match[0]) : 1;
};

// data-model defines status in a different format to what is stored in BO db, so some mapping needed
const mapStatus = (status) =>
	({
		checked: 'checked',
		unchecked: 'not_checked',
		readytopublish: 'ready_to_publish',
		published: 'published',
		donotpublish: 'do_not_publish',

		// TODO remove these values below once ODW has mapped them in curated layer (ODW-1122)
		depublished: 'not_checked',
		notchecked: 'not_checked'
	}[status?.replaceAll(' ', '')]);

const generateNamesFromFromField = (from) => {
	let firstName, lastName, otherNames;
	if (!from) {
		return { firstName: '', lastName: '' };
	}
	from = removeUnnecessarySpaces(from);
	[firstName, ...otherNames] = from.split(' ');
	lastName = otherNames.join(' ');
	return { firstName, lastName };
};
const generateAdviceTitleForFo = ({ enquiryMethod, enquirer, firstName, lastName }) => {
	const adviceNameParams = { enquirer, firstName, lastName };
	return enquiryMethod === 'meeting'
		? `Meeting with ${generateAdviceName(adviceNameParams)}`
		: `Advice to ${generateAdviceName(adviceNameParams)}`;
};

const generateAdviceName = ({ enquirer, firstName, lastName }) => {
	if (enquirer) {
		return enquirer;
	} else if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	} else if (firstName) {
		return `${firstName}`;
	} else {
		return 'Anonymous';
	}
};

const handleRejectedPromises = (promiseList) => {
	const rejectedPromises = promiseList.filter((promise) => promise.status === 'rejected');
	if (rejectedPromises.length > 0) {
		rejectedPromises.forEach((promise) => console.error(promise.reason));
		if (rejectedPromises.length > 1) {
			const uniqueErrors = [...new Set(rejectedPromises.map((promise) => promise.reason.message))];
			const errorObject = uniqueErrors.reduce((acc, error, index) => {
				acc[`Error ${index + 1}`] = error;
				return acc;
			}, {});

			throw Error(
				`Multiple S51Advice migrations failed. Error list: ${JSON.stringify(errorObject, null, 2)}`
			);
		} else {
			throw Error(`An S51 Advice migration failed. Error: ${rejectedPromises[0].reason.message}`);
		}
	}
};
