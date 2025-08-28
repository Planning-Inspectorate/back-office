import { EventType } from '@pins/event-client';
import * as documentRepository from '#repositories/document.repository.js';
import * as documentVersionRepository from '#repositories/document-metadata.repository.js';
import { YouTubeHTMLTemplate } from './youtube-html-template.js';
import { broadcastNsipDocumentEvent } from '#infrastructure/event-broadcasters.js';

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

	// broadcast event message - ignore training cases
	await broadcastNsipDocumentEvent(updatedDocument, eventType);

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
 * Try to get the title from html template (old HZN version).
 * Currently only working for migration, as the UI upload version sanitises the html and removes all but the iframe attr
 *
 * @param {string} html
 */
export const extractYouTubeTitleFromHTML = (html) => {
	let htmlTitle = '';
	/* and try to extract the title

	 should look like this:
        <p>

          <!-- ************************************ -->

          <!-- Recording details -->

          <span style="text-align:center"><strong>Here is the title to display</strong></span>

        </p>
	*/
	//	console.log('\n\n==============================================\n\nhtml:', JSON.stringify(html));
	if (html.includes('Recording details')) {
		console.log('Recording details found in old HTML template');
		const titleSection = html.substring(html.indexOf('Recording details'), html.indexOf('</span>'));
		if (titleSection.includes('<span style="text-align:center"><strong>')) {
			htmlTitle = titleSection
				.substring(titleSection.indexOf('<strong>') + 8, titleSection.indexOf('</strong>'))
				.trim();
		}
	}
	return htmlTitle;
};

/**
 * Render HTML YouTube template for Front Office, inserting YouTube URL and Title
 *
 * @param {string} youtubeUrl
 * @param {string |undefined} htmlTitle
 * @returns {string}
 * */
export const renderYouTubeTemplate = (youtubeUrl, htmlTitle = 'Video title') => {
	// APPLICS-1490 NOTE: the html validation expects the title to be 'Video title', so we cant change it to anything else here
	let newHTML = YouTubeHTMLTemplate;
	newHTML = newHTML.replace('{{youtubeUrl}}', youtubeUrl);
	newHTML = newHTML.replace('{{htmlTitle}}', htmlTitle);

	return newHTML;
};
