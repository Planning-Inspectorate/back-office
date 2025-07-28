import { patch } from '../../../../../lib/request.js';
import { getAzureTextAnalyticsClient } from '../../../../../lib/azure-ai-language.js';
import logger from '../../../../../lib/logger.js';

export const REDACT_CHARACTER = '█';
// Azure AI Language service has a limit of 5120 characters per request
// https://aka.ms/text-analytics-data-limits"
export const MAX_REDACTION_LENGTH = 5000;
export const MIN_CONFIDENCE_SCORE = 0.8;
export const MAX_AZURE_LANGUAGE_REQUESTS = 3;

/**
 *
 * @param {string} caseId
 * @param {string} representationId
 * @param {object} body
 * @param {string} body.redactedRepresentation
 * @param {string} body.notes
 * @param {string} body.actionBy
 * @returns {Promise<any>}
 */
export const patchRepresentationRedact = async (
	caseId,
	representationId,
	{ redactedRepresentation, notes, actionBy }
) =>
	await patch(`applications/${caseId}/representations/${representationId}/redact`, {
		json: {
			redactedRepresentation,
			notes,
			actionBy
		}
	});

/**
 * @param {string} originalRepresentation
 * @param {function(): import('@azure/ai-text-analytics').TextAnalyticsClient} [getTextAnalyticsClient] - override for testing
 * @returns {Promise<import('@azure/ai-text-analytics').RecognizePiiEntitiesSuccessResult|null>}
 */
export async function fetchRedactionSuggestions(
	originalRepresentation,
	getTextAnalyticsClient = getAzureTextAnalyticsClient
) {
	if (!originalRepresentation || originalRepresentation.length === 0) {
		return null;
	}
	try {
		const textAnalyticsClient = getTextAnalyticsClient();

		logger.info({ originalRepresentation: originalRepresentation.length }, 'rep size');
		// split the representation into chunks, as Azure AI Language service has a limit of 5120 characters per request
		const strChunks = stringToChunks(originalRepresentation, MAX_REDACTION_LENGTH);
		// split the chunks into arrays of 5, as Azure AI Language service has a limit of 5 'documents' per request
		const reqChunks = arrayToArrays(strChunks, 5);
		if (reqChunks.length > MAX_AZURE_LANGUAGE_REQUESTS) {
			logger.warn(
				{ reqChunks: reqChunks.length, originalRepresentation: originalRepresentation.length },
				'Too many chunks for Azure AI Language Redaction, skipping redaction, falling back to legacy view'
			);
			return null;
		}
		/** @type {import('@azure/ai-text-analytics').RecognizePiiEntitiesResult[]} */
		const results = [];
		for (const chunks of reqChunks) {
			const res = await textAnalyticsClient.recognizePiiEntities(chunks, 'en', {
				// TODO: refine this list, and make this configurable
				categoriesFilter: ['Address', 'Organization', 'Person', 'PhoneNumber', 'Email', 'URL']
			});
			results.push(...res);
		}

		if (isSuccessResults(results)) {
			const { entities, redactedText } = combineResults(results, originalRepresentation);
			return { entities, redactedText, id: '', warnings: [] };
		}
		logger.error(
			{ errors: results.map((result) => result.error) },
			'Error in Azure AI Language Redaction results'
		);
		return null;
	} catch (error) {
		// Log the error and fallback to no suggestions/legacy view
		logger.error(
			{ error },
			'Error fetching Azure AI Language Redaction results, falling back to legacy view'
		);
		return null;
	}
}

/**
 * Highlight redaction suggestions in the comment text
 *
 * @param {string} text
 * @param {import('@azure/ai-text-analytics').PiiEntity[]} entities
 * @returns {string} text with <mark> tags
 */
export function highlightRedactionSuggestions(text, entities) {
	let highlighted = text;
	// reverse order so that the offsets are still valid
	for (let i = entities.length - 1; i >= 0; i--) {
		const entity = entities[i];
		highlighted =
			highlighted.substring(0, entity.offset) +
			'<mark>' +
			entity.text +
			'</mark>' +
			highlighted.substring(entity.offset + entity.length);
	}
	return highlighted;
}

/**
 * @param {import('@azure/ai-text-analytics').RecognizePiiEntitiesSuccessResult[]} results
 * @param {string} originalText
 * @returns {{entities: import('@azure/ai-text-analytics').PiiEntity[], redactedText: string}}
 */
export function combineResults(results, originalText) {
	/** @type {import('@azure/ai-text-analytics').PiiEntity[]} */
	const list = [];
	const entities = results
		.reduce((acc, result, currentIndex) => {
			if (result.entities) {
				// adjust the offsets of the entities based on the chunk index
				acc.push(
					...result.entities.map((entity) => ({
						...entity,
						offset: entity.offset + currentIndex * MAX_REDACTION_LENGTH
					}))
				);
			}
			return acc;
		}, list)
		.filter((entity) => entity.confidenceScore >= MIN_CONFIDENCE_SCORE); // filter out low confidence entities;
	let redactedText = originalText || '';
	for (const entity of entities) {
		// replace the entity text with the redaction character
		redactedText =
			redactedText.substring(0, entity.offset) +
			REDACT_CHARACTER.repeat(entity.length) +
			redactedText.substring(entity.offset + entity.length);
	}
	return { entities, redactedText };
}

/**
 * @param {import('@azure/ai-text-analytics').RecognizePiiEntitiesResult[]} results
 * @returns {results is import('@azure/ai-text-analytics').RecognizePiiEntitiesSuccessResult[]}
 */
function isSuccessResults(results) {
	return results.every(isSuccessResult);
}

/**
 * @param {import('@azure/ai-text-analytics').RecognizePiiEntitiesResult} result
 * @returns {result is import('@azure/ai-text-analytics').RecognizePiiEntitiesSuccessResult}
 */
function isSuccessResult(result) {
	return Boolean(result && !result.error && result.entities);
}

/**
 * @param {T[]} array
 * @param {number} maxArraySize
 * @returns {T[][]}
 * @template T
 */
export function arrayToArrays(array, maxArraySize) {
	const copy = array.slice();
	const arrays = [];
	while (copy.length > 0) {
		arrays.push(copy.splice(0, maxArraySize));
	}
	return arrays;
}

/**
 * @param {string} str
 * @param {number} chunkSize
 * @returns {string[]}
 */
export function stringToChunks(str, chunkSize) {
	const chunks = [];
	while (str.length > 0) {
		chunks.push(str.substring(0, chunkSize));
		str = str.substring(chunkSize, str.length);
	}
	return chunks;
}
