import { NotifyClient as GovNotify } from 'notifications-node-client';
import config from '#config/config.js';
import logger from './logger.js';
import {
	ERROR_FAILED_TO_SEND_NOTIFICATION_EMAIL,
	ERROR_GOV_NOTIFY_API_KEY_NOT_SET,
	NODE_ENV_PRODUCTION
} from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.NotifyTemplate} NotifyTemplate */

class NotifyClient {
	/** @type {any} */
	govNotify = null;

	constructor() {
		this.init();
	}

	init() {
		if (config.govNotify.api.key) {
			this.govNotify = new GovNotify(config.govNotify.api.key);
			return;
		}

		logger.error(ERROR_GOV_NOTIFY_API_KEY_NOT_SET);
	}

	/**
	 * @param {string} recipientEmail
	 * @returns {string}
	 */
	setRecipientEmail(recipientEmail) {
		const {
			govNotify: { testMailbox },
			NODE_ENV
		} = config;

		return (recipientEmail =
			testMailbox || NODE_ENV !== NODE_ENV_PRODUCTION ? testMailbox : recipientEmail);
	}

	/**
	 * @param {NotifyTemplate} template
	 * @param {string | undefined} recipientEmail
	 * @param {{[key: string]: string}} [personalisation]
	 */
	sendEmail(template, recipientEmail, personalisation) {
		try {
			if (this.govNotify && recipientEmail) {
				return this.govNotify.sendEmail(template.id, this.setRecipientEmail(recipientEmail), {
					emailReplyToId: null,
					personalisation,
					reference: null
				});
			}

			logger.error(ERROR_FAILED_TO_SEND_NOTIFICATION_EMAIL);
		} catch (error) {
			logger.error(error);
		}
	}
}

export default NotifyClient;
