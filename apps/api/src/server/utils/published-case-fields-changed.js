import * as caseRepository from '../repositories/case.repository.js';
import BackOfficeAppError from './app-error.js';
import { buildNsipProjectPayload } from '../applications/application/application.js';

/** @typedef {import('@pins/applications.api').Schema.Case} Case */

/**
 * Checks whether the given column name is included when the case is published
 *
 * @param {Case} original
 * @param {Case} updated
 * @returns {boolean}
 * */
const publishedCaseFieldsHaveChanged = (original, updated) => {
	const originalEvent = buildNsipProjectPayload(original);
	const updatedEvent = buildNsipProjectPayload(updated);

	return JSON.stringify(originalEvent) !== JSON.stringify(updatedEvent);
};

/**
 * If `hasUnpublishedChanges = false` and publishable changes have been made,
 * set `hasUnpublishedChanges = true`, otherwise just return `updated`
 *
 * @param {import('@pins/applications.api').Schema.Case} original
 * @param {import('@pins/applications.api').Schema.Case} updated
 * @returns {Promise<import('@pins/applications.api').Schema.Case>}
 * @throws {BackOfficeAppError}
 * */
export const setCaseUnpublishedChangesIfTrue = async (original, updated) => {
	if (updated.hasUnpublishedChanges) {
		return updated;
	}

	const publishableFieldsChanged = publishedCaseFieldsHaveChanged(original, updated);
	if (!publishableFieldsChanged) {
		return updated;
	}

	const result = await caseRepository.updateApplication({
		caseId: updated.id,
		hasUnpublishedChanges: true
	});

	if (!result) {
		throw new BackOfficeAppError(
			`Could not return updated application with id: ${updated.id}`,
			500
		);
	}

	return result;
};
