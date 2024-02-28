import { EventType } from '@pins/event-client';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';
import { buildNsipDocumentPayload } from '../application/documents/document.js';
import * as documentRepository from '#repositories/document.repository.js';
import * as documentVersionRepository from '#repositories/document-metadata.repository.js';
import logger from '#utils/logger.js';
import { YouTubeHTMLTemplate } from './youtube-html-template.js';

/**
 * @param {string} guid
 * @param {string} status
 */
export const updateStatus = async (guid, status) => {
	const document = await documentRepository.getByDocumentGUID(guid);

	if (!document) {
		return;
	}

	const updatePayload = {
		guid,
		status,
		version: document?.latestVersionId || 1
	};

	let updatedDocument;

	if (status === 'published') {
		// @ts-ignore
		updatePayload.datePublished = new Date();
		updatedDocument = await documentVersionRepository.updateDocumentPublishedStatus(updatePayload);
	} else {
		updatedDocument = await documentVersionRepository.updateDocumentStatus(updatePayload);
	}

	const eventType =
		updatedDocument.publishedStatus === 'published' ? EventType.Publish : EventType.Update;

	try {
		await eventClient.sendEvents(
			NSIP_DOCUMENT,
			[buildNsipDocumentPayload(updatedDocument)],
			eventType
		);
	} catch (err) {
		logger.warn(err, 'failed to publish NSIP_DOCUMENT event');
	}

	return {
		caseId: document.caseId,
		guid: updatedDocument.documentGuid,
		status: updatedDocument.publishedStatus
	};
};

/**
 * Extract YouTube URL from an iframe in a snippet of HTML
 *
 * @param {string} html
 * @returns {string}
 * */
export const extractYouTubeURLFromHTML = (html) => {
	if (!html.includes('<iframe')) {
		throw new Error('No iframe found in the HTML');
	}

	// this could be simplified with a regex, but it would expose the code to malicious exploits
	// 	(/<iframe.+?src=["|'](.+?)["|']/)
	const iframe = (html || '').split('<iframe');
	const match = iframe.length > 1 ? iframe[1].split('>') : [''];

	const isYouTube = /^https?:\/\/(www\.)?(youtube.com|youtu.be).+$/.test(match[0]);
	if (!isYouTube) {
		throw new Error(`iframe src is not a YouTube URL: ${match[1]}`);
	}

	return match[1];
};

/**
 * Render HTML YouTube template for Front Office
 *
 * @param {string} youtubeUrl
 * @returns {string}
 * */
export const renderYouTubeTemplate = (youtubeUrl) =>
	YouTubeHTMLTemplate.replace('{{youtubeUrl}}', youtubeUrl);
