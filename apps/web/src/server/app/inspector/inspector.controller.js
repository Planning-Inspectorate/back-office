import { findAppealById } from './inspector.service.js';

/** @typedef {import('@pins/inspector').Appeal} Appeal */

/**
 * @typedef {Object} AppealParams
 * @property {string} appealId – Unique identifier for the appeal.
 */

/**
 * @typedef {Object} ViewAppealDetailsRenderOptions
 * @property {Appeal} appeal – The appeal entity.
 */

/**
 * View the appeal details as an inspector.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ViewAppealDetailsRenderOptions>}
 */
export async function viewAppealDetails({ params }, response) {
	const appeal = await findAppealById(params.appealId);

	response.render('inspector/appeal-details', { appeal });
}
