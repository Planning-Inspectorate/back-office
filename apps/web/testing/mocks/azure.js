import msal from '@azure/msal-node';
import { jest } from '@jest/globals';
import { last } from 'lodash-es';
import { createAccountInfo } from '../factory/account-info.js';

/** @type {ConfidentialClientApplication[]} */

const confidentialClientApplications = [];

export class ConfidentialClientApplication extends msal.ConfidentialClientApplication {
	/** @param {import('@azure/msal-node').Configuration} config */
	constructor(config) {
		super(config);
		this.configuration = config;
		confidentialClientApplications.push(this);
	}

	acquireTokenByCode = jest.fn(() =>
		Promise.resolve(
			/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
				account: createAccountInfo({ name: 'Test user' })
			})
		)
	);

	getAuthCodeUrl = jest.fn(() => Promise.resolve('/test/azure-msal/signin'));
}

const mock = {
	confidentialClientApplications: {
		get last() {
			return last(confidentialClientApplications);
		}
	}
};

export const getMock = () => mock;

msal.ConfidentialClientApplication = ConfidentialClientApplication;
