// @ts-nocheck
import * as msal from '@azure/msal-node';
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

	acquireTokenSilent = jest.fn((presetUser) =>
		Promise.resolve(
			/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
				account: { ...this.account, idTokenClaims: presetUser.account.idTokenClaims }
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

// This does not work after msal-node v2
// msal.ConfidentialClientApplication = ConfidentialClientApplication;
