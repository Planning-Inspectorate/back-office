// @ts-nocheck
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

		/** @type {import('@pins/platform').PlanningInspectorAccountInfo} account */
		this.account = createAccountInfo({ name: 'Test user' });

		/** @type {import('@azure/msal-node').Configuration} */
		this.configuration = config;

		confidentialClientApplications.push(this);
	}

	acquireTokenByCode = jest.fn(() =>
		Promise.resolve(
			/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
				account: this.account,
				idTokenClaims: {
					nonce: this.nonce
				}
			})
		)
	);

	// @ts-ignore
	acquireTokenByClientCredential = jest.fn(() =>
		Promise.resolve(
			/** @type {Partial<import('@azure/msal-node').AuthenticationResult>} */ ({
				accessToken: 'accessToken',
				expiresOn: {
					getTime: () => jest.fn(() => Date.now() + 3600)
				}
			})
		)
	);

	acquireTokenSilent = jest.fn(() =>
		Promise.resolve(
			/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
				account: this.account
			})
		)
	);

	getAuthCodeUrl = jest.fn(({ nonce }) => {
		this.nonce = nonce;

		return Promise.resolve('/test/azure-msal/signin');
	});
}

const mock = {
	confidentialClientApplications: {
		get last() {
			return last(confidentialClientApplications);
		}
	}
};

ConfidentialClientApplication.getMock = () => mock;

msal.ConfidentialClientApplication = ConfidentialClientApplication;
