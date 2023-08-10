/**
 * @typedef {import('@pins/applications.api/src/message-schemas/events/nsip-project-update.js').NSIPProjectUpdate} NSIPProjectUpdate
 */

import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';
import { Subscription } from '@pins/applications/lib/application/subscription.js';
import TurndownService from 'turndown';
import { PagedRequest } from './paged-request.js';
import { sleep } from './util.js';

export class NotifySubscribers {
	/** @type {import('./back-office-api-client.js').BackOfficeApiClient} */
	apiClient;
	/** @type {import('notifications-node-client').NotifyClient} */
	notifyClient;
	/** @type {string} */
	templateId;
	/** @type {NSIPProjectUpdate} */
	msg;
	/** @type {import('@azure/functions').Logger}  */
	logger;
	/** @type {import('@pins/applications').ProjectUpdate|undefined} */
	update;
	/** @type {number} */
	perPage;
	/** @type {number} */
	waitPerPage;
	/** @type {import('./types.js').GenerateUnsubscribeLink} */
	generateUnsubscribeLink;
	/**
	 *
	 * @param {Object} opts
	 * @param {import('./back-office-api-client.js').BackOfficeApiClient} opts.apiClient
	 * @param {import('notifications-node-client').NotifyClient} opts.notifyClient
	 * @param {string} opts.templateId
	 * @param {NSIPProjectUpdate} opts.msg
	 * @param {import('@azure/functions').Logger} opts.logger
	 * @param {number} opts.perPage
	 * @param {number} opts.waitPerPage
	 * @param {import('./types.js').GenerateUnsubscribeLink} opts.generateUnsubscribeLink
	 */
	constructor({
		apiClient,
		notifyClient,
		templateId,
		msg,
		logger,
		perPage,
		waitPerPage,
		generateUnsubscribeLink
	}) {
		this.apiClient = apiClient;
		this.notifyClient = notifyClient;
		this.templateId = templateId;
		this.msg = msg;
		this.logger = logger;
		this.perPage = perPage;
		this.waitPerPage = waitPerPage;
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
		const update = await this.getUpdate();

		if (update === null) {
			this.logger.error(`update doesn't exist with ID '${this.msg.id}'`);
			return;
		}

		this.update = update;

		if (!this.update.emailSubscribers) {
			this.logger.warn('emailSubscribers == false');
			return;
		}

		// just to be sure
		if (this.update.status !== ProjectUpdate.Status.published) {
			throw new Error(`update is no longer published`);
		}

		const content = NotifySubscribers.htmlToMarkdown(this.update.htmlContent);
		const subscriptionType = NotifySubscribers.subscriptionType(this.update.type);
		await this.notifySubscribers({
			content,
			subscriptionType,
			caseReference: this.msg.caseReference
		});
	}

	/**
	 * Fetch all subscribers (a page at a time) and send an email to each one
	 *
	 * @param {Object} opts
	 * @param {string} opts.content
	 * @param {string} opts.subscriptionType
	 * @param {string} opts.caseReference
	 */
	async notifySubscribers({ content, subscriptionType, caseReference }) {
		const subscriptions = new PagedRequest(this.perPage, (page, pageSize) => {
			return this.apiClient.getSubscriptions(page, pageSize, {
				caseReference,
				type: subscriptionType
			});
		});

		// do one page at a time
		for await (const page of subscriptions) {
			// notify all subscribers (per page) in parrallel
			await Promise.all(
				page.items.map((subscription) =>
					this.notifySubscriber(subscription, content, caseReference)
				)
			);

			// wait between pages
			// see https://docs.notifications.service.gov.uk/rest-api.html#rate-limits
			await sleep(1000 * this.waitPerPage);
		}
	}

	/**
	 * Send an email individual subscriber
	 *
	 * @param {import('@pins/applications').Subscription} subscription
	 * @param {string} content
	 * @param {string} caseReference
	 */
	async notifySubscriber(subscription, content, caseReference) {
		try {
			const reference = [caseReference, this.update?.id, subscription.id].join('-');
			const unsubscribe = this.generateUnsubscribeLink(caseReference, subscription.emailAddress);
			await this.notifyClient.sendEmail(this.templateId, subscription.emailAddress, {
				personalisation: {
					content,
					unsubscribe
					// todo: project link
				},
				reference
			});
		} catch (e) {
			this.logger.warn(`notify error: ${e.message}`, { error: e });
		}
		// TODO: record send/fail in DB
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
	 * @returns {Promise<import('@pins/applications').ProjectUpdate>}
	 */
	getUpdate() {
		return this.apiClient.getProjectUpdate(this.msg.id);
	}

	/**
	 * Format the HTML as markdown, for GovNotify
	 *
	 * @param {string} content
	 * @returns {string}
	 */
	static htmlToMarkdown(content) {
		const turndownService = new TurndownService();
		return turndownService.turndown(content);
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
