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
 * @param {string} originalHtml
 * @returns {string}
 * */
export const extractYouTubeURLFromHTML = (originalHtml) => {
	// this could all be simplified with a regex, but it would expose the code to malicious exploits
	const html = originalHtml.replaceAll('IFRAME', 'iframe');
	if (!(html.includes('<iframe') && html.includes('</iframe>'))) {
		throw new Error('No iframe found in the HTML');
	}

	const iframe = html.substring(html.indexOf('<iframe') + 7, html.indexOf('</iframe'));
	const iframeAttributes = iframe.split(/["|']/);
	const iframeSrcIndex =
		iframeAttributes.findIndex((text) => text.toLowerCase().includes('src=')) + 1;
	if (!iframeSrcIndex) {
		throw new Error('No iframe src found in the HTML');
	}

	const iframeSrc = iframeAttributes[iframeSrcIndex];
	const isYouTube = /^https?:\/\/(www\.)?(youtube.com|youtu.be).+$/.test(iframeSrc);
	if (!isYouTube) {
		throw new Error(`iframe src is not a YouTube URL: ${iframeSrc}`);
	}

	return iframeSrc;
};

/**
 * Render HTML YouTube template for Front Office
 *
 * @param {string} youtubeUrl
 * @returns {string}
 * */
export const renderYouTubeTemplate = (youtubeUrl) =>
	YouTubeHTMLTemplate.replace('{{youtubeUrl}}', youtubeUrl);
