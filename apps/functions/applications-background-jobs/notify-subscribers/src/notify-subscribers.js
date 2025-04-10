/**
 * @typedef {import('pins-data-model').Schemas.NSIPProjectUpdate} NSIPProjectUpdate
 */

import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { Subscription } from '@pins/applications/lib/application/subscription.js';
import TurndownService from 'turndown';
import { PagedRequest } from './paged-request.js';
import { encodeLinksForMarkdown, sleep } from './util.js';

export class NotifySubscribers {
	/** @type {import('./back-office-api-client.js').BackOfficeApiClient} */
	apiClient;
	/** @type {import('notifications-node-client').NotifyClient} */
	notifyClient;
	/** @type {string} */
	templateId;
	/** @type {string} */
	templateIdWelsh;
	/** @type {NSIPProjectUpdate} */
	msg;
	/** @type {import('@azure/functions').Logger}  */
	logger;
	/** @type {string}  */
	invocationId;
	/** @type {number} */
	perPage;
	/** @type {number} */
	waitPerPage;
	/** @type {import('./types.js').GenerateProjectLink} */
	generateProjectLink;
	/** @type {import('./types.js').GenerateUnsubscribeLink} */
	generateUnsubscribeLink;
	/**
	 *
	 * @param {Object} opts
	 * @param {import('./back-office-api-client.js').BackOfficeApiClient} opts.apiClient
	 * @param {import('notifications-node-client').NotifyClient} opts.notifyClient
	 * @param {string} opts.templateId
	 * @param {string} opts.templateIdWelsh
	 * @param {NSIPProjectUpdate} opts.msg
	 * @param {import('@azure/functions').Logger} opts.logger
	 * @param {string} opts.invocationId
	 * @param {number} opts.perPage
	 * @param {number} opts.waitPerPage
	 * @param {import('./types.js').GenerateProjectLink} opts.generateProjectLink
	 * @param {import('./types.js').GenerateUnsubscribeLink} opts.generateUnsubscribeLink
	 */
	constructor({
		apiClient,
		notifyClient,
		templateId,
		templateIdWelsh,
		msg,
		logger,
		invocationId,
		perPage,
		waitPerPage,
		generateProjectLink,
		generateUnsubscribeLink
	}) {
		this.apiClient = apiClient;
		this.notifyClient = notifyClient;
		this.templateId = templateId;
		this.templateIdWelsh = templateIdWelsh;
		this.msg = msg;
		this.logger = logger;
		this.invocationId = invocationId;
		this.perPage = perPage;
		this.waitPerPage = waitPerPage;
		this.generateProjectLink = generateProjectLink;
		this.generateUnsubscribeLink = generateUnsubscribeLink;
	}

	/**
	 * Run the function logic to notify subscribers
	 * @returns {Promise<void>}
	 */
	async run() {
		if (!this.messageIsValid()) {
			return;
		}
		const update = await this.getExtendedUpdate();

		if (update === null) {
			throw new Error(
				`update with id '${this.msg.id}' not found on case ${this.msg.caseReference}`
			);
		}

		if (!update.emailSubscribers) {
			this.logger.info(`update (id ${update.id}) emailSubscribers == false`);
			return;
		}

		if (update.sentToSubscribers) {
			this.logger.info(`update (id ${update.id}) already sent to subscribers`);
			return;
		}

		// just to be sure
		if (update.status !== ProjectUpdate.Status.published) {
			throw new Error(`update (id ${update.id}) is no longer published`);
		}
		// update sentToSubscribers early, to reduce changes of handling notify twice
		await this.apiClient.patchProjectUpdate(update.id, update.caseId, true);

		const content = NotifySubscribers.htmlToMarkdown(update.htmlContent);
		const contentWelsh = update.htmlContentWelsh
			? NotifySubscribers.htmlToMarkdown(update.htmlContentWelsh)
			: null;

		const subscriptionType = NotifySubscribers.subscriptionType(update.type);
		await this.notifySubscribers({
			update,
			content,
			contentWelsh,
			subscriptionType,
			caseReference: this.msg.caseReference
		});
	}

	/**
	 * Fetch all subscribers (a page at a time) and send an email to each one
	 *
	 * @param {Object} opts
	 * @param {import('./types.js').ExtendedProjectUpdate} opts.update
	 * @param {string} opts.content
	 * @param {string | null} opts.contentWelsh
	 * @param {string} opts.subscriptionType
	 * @param {string} opts.caseReference
	 */
	async notifySubscribers({ update, content, contentWelsh, subscriptionType, caseReference }) {
		const now = new Date();
		const subscriptions = new PagedRequest(this.perPage, (page, pageSize) => {
			return this.apiClient.getSubscriptions(page, pageSize, {
				caseReference,
				type: subscriptionType,
				endAfter: now // only get subscriptions still valid after 'now' (i.e. not unsubscribed)
			});
		});
		let total = 0;
		let pageCount = 0;

		// do one page at a time
		for await (const page of subscriptions) {
			total += page.items.length;
			pageCount++;
			this.logger.info(
				`processing ${page.items.length} subscribers (running total: ${total}, page ${pageCount})`
			);

			// notify all subscribers (per page) in parallel
			const logs = await Promise.all(
				page.items.map((subscription) =>
					this.notifySubscriber(update, subscription, content, contentWelsh, caseReference)
				)
			);

			// save the logs for this page
			await this.apiClient.postNotificationLogs(update.id, update.caseId, logs);

			// wait between pages
			// see https://docs.notifications.service.gov.uk/rest-api.html#rate-limits
			await sleep(1000 * this.waitPerPage);
		}
		this.logger.info(`processed all subscribers, total ${total}`);
	}

	/**
	 * Send an email individual subscriber
	 *
	 * @param {import('./types.js').ExtendedProjectUpdate} update
	 * @param {import('@pins/applications').Subscription} subscription
	 * @param {string} content
	 * @param {string | null} contentWelsh
	 * @param {string} caseReference
	 * @returns {Promise<import('@pins/applications').ProjectUpdateNotificationLogCreateReq>}
	 */
	async notifySubscriber(update, subscription, content, contentWelsh, caseReference) {
		if (!subscription.id) {
			throw new Error(`no subscription ID`);
		}
		const logEntry = {
			emailSent: false,
			entryDate: new Date().toISOString(),
			functionInvocationId: this.invocationId,
			projectUpdateId: update.id,
			subscriptionId: subscription.id
		};
		try {
			const reference = [caseReference, update.id, subscription.id].join('-');
			const projectLink = this.generateProjectLink(caseReference);
			const unsubscribeUrl = this.generateUnsubscribeLink(caseReference, subscription.emailAddress);
			const projectName = update.projectName || caseReference;
			const projectNameWelsh = update.projectNameWelsh || caseReference;

			const templateId = contentWelsh ? this.templateIdWelsh : this.templateId;

			await this.notifyClient.sendEmail(templateId, subscription.emailAddress, {
				personalisation: {
					projectName,
					projectLink,
					title: `${projectName} - Project Update`,
					subject: `${projectName} - Project Update Notification`,
					content,
					...(contentWelsh
						? {
								contentWelsh,
								titleWelsh: `${projectNameWelsh} - Diweddariad ar Brosiect`,
								subjectWelsh: `${projectNameWelsh} - Hysbysiad o Ddiweddariad ar Brosiect`
						  }
						: {}),
					unsubscribeUrl
				},
				reference
			});
			logEntry.emailSent = true;
		} catch (e) {
			this.logger.warn(`notify error: ${e.message}`, { error: e });
		}
		return logEntry;
	}

	/**
	 * Is this message valid and ready to be handled?
	 *
	 * @returns {boolean}
	 */
	messageIsValid() {
		const msg = this.msg;
		if (!msg) {
			this.logger.warn('no message');
			return false;
		}
		if (msg.updateStatus !== ProjectUpdate.Status.published) {
			this.logger.warn('update not published');
			return false;
		}
		if (!msg.caseReference) {
			this.logger.warn('no case reference');
			return false;
		}
		if (!msg.updateContentEnglish) {
			this.logger.warn('no update content');
			return false;
		}
		return true;
	}

	/**
	 * @returns {Promise<import('@pins/applications').ProjectUpdate|null>}
	 */
	getUpdate() {
		return this.apiClient.getProjectUpdate(this.msg.id);
	}

	/**
	 * @returns {Promise<import('./types.js').ExtendedProjectUpdate|null>}
	 */
	getExtendedUpdate() {
		return this.apiClient.getExtendedProjectUpdate(this.msg.caseReference, this.msg.id);
	}

	/**
	 * Format the HTML as markdown, for GovNotify
	 *
	 * @param {string} content
	 * @returns {string}
	 */
	static htmlToMarkdown(content) {
		const turndownService = new TurndownService({ strongDelimiter: '', emDelimiter: '' });
		return turndownService.turndown(encodeLinksForMarkdown(content));
	}

	/**
	 * Which subscription type do we want to filter on when fetching subscriptions?
	 * This corresponds to the update type.
	 *
	 * @param {string} updateType
	 * @returns {import('@pins/applications').SubscriptionType}
	 */
	static subscriptionType(updateType) {
		switch (updateType) {
			case ProjectUpdate.Type.applicationSubmitted:
				return Subscription.Type.applicationSubmitted;
			case ProjectUpdate.Type.applicationDecided:
				return Subscription.Type.applicationDecided;
			case ProjectUpdate.Type.registrationOpen:
				return Subscription.Type.registrationOpen;
		}
		return Subscription.Type.allUpdates;
	}
}
