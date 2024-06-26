import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {
	ConfidentialClientApplication,
	createAccountInfo
} from '../../../../../testing/app/app.js';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, teardown } = createTestEnvironment({ authenticated: false });
const request = supertest(app);
const azureMsalMock = ConfidentialClientApplication.getMock();

describe('auth', () => {
	afterEach(teardown);

	describe('authentication', () => {
		it('should sign in an unauthenticated user via azure SSO', async () => {
			const response = await request.get('/applications-service').redirects(1);
			const client = getConfidentialClientApplication();

			// Assert azure msal client was instantiated correctly

			expect(client?.configuration.auth).toEqual({
				authority: 'https://login.microsoftonline.com/auth_tenant_id',
				clientId: 'auth_client_id',
				clientSecret: 'auth_client_secret'
			});

			// Assert azure msal client's `getAuthCodeUrl` was invoked correctly

			const [authOptions] = /** @type {import('@azure/msal-node').AuthorizationUrlRequest[]} */ (
				client.getAuthCodeUrl.mock.lastCall
			);

			expect(authOptions.authority).toEqual('https://login.microsoftonline.com/auth_tenant_id');
			expect(authOptions.redirectUri).toEqual(expect.stringMatching('^https?://.*/auth/redirect'));
			expect(authOptions.scopes).toEqual(['user.read']);
			expect(authOptions.nonce).toBeTruthy();

			expect(response.get('Location')).toEqual('/test/azure-msal/signin');
			// Invoke the redirect from azure's SSO

			const redirect = await request.get('/auth/redirect?code=msal_code');
			const [tokenOptions] = /** @type {import('@azure/msal-node').AuthorizationCodeRequest[]} */ (
				client.acquireTokenByCode.mock.lastCall
			);

			expect(tokenOptions.authority).toEqual('https://login.microsoftonline.com/auth_tenant_id');
			expect(tokenOptions.redirectUri).toEqual(expect.stringMatching('^https?://.*/auth/redirect'));
			expect(tokenOptions.scopes).toEqual(['user.read']);
			expect(tokenOptions.code).toEqual('msal_code');

			expect(redirect.get('Location')).toEqual('/applications-service');
		});

		it('should redirect to an error page when the redirect from MSAL is incomplete', async () => {
			const response = await request.get('/auth/redirect').redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});

		it('should redirect to an error page when the nonce is absent from the acquired token', async () => {
			await request.get('/').redirects(1);

			const client = getConfidentialClientApplication();

			client.acquireTokenByCode.mockImplementationOnce(() =>
				Promise.resolve(
					/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
						account: client.account,
						// omit expected `nonce` value from authentication result
						idTokenClaims: {}
					})
				)
			);

			const response = await request.get('/auth/redirect?code=msal_code').redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with your login'
			);
		});

		it('should redirect to an error page when the nonce in the acquired token does not match', async () => {
			await request.get('/').redirects(1);

			const client = getConfidentialClientApplication();

			client.acquireTokenByCode.mockImplementationOnce(() =>
				Promise.resolve(
					/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
						account: client.account,
						// omit expected `nonce` value from authentication result
						idTokenClaims: {
							nonce: '*'
						}
					})
				)
			);

			const response = await request.get('/auth/redirect?code=msal_code').redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with your login'
			);
		});

		it('should redirect to an error page when fetching the auth url fails', async () => {
			getConfidentialClientApplication().getAuthCodeUrl.mockImplementationOnce(() =>
				Promise.reject(new Error('*'))
			);

			const response = await request.get(`/`).redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});

		it('should redirect to an error page when acquiring the access token fails', async () => {
			await request.get('/auth/signin');

			getConfidentialClientApplication().acquireTokenByCode.mockImplementationOnce(() =>
				Promise.reject(new Error('*'))
			);

			const response = await request.get('/auth/redirect?code=msal_code').redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});

		it('should silently reacquire a token on each route navigation', async () => {
			await signinWithGroups(['applications_case_team']);
			await request.get('/');

			const client = getConfidentialClientApplication();

			expect(client.acquireTokenSilent).toHaveBeenCalledWith({
				account: client.account,
				scopes: ['user.read']
			});
		});

		it('should clear any pending authentication data if the MSAL redirect is not subsequently invoked', async () => {
			// start the MSAL authentication flow
			await request.get('/auth/signin');
			// trigger an intermediary request while awaiting MSAL redirect
			await request.get('/');

			// complete MSAL redirect after authentication data has been cleared
			const response = await request.get('/auth/redirect?code=msal_code').redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should display a logout link in the header when the user is authenticated', async () => {
			// visit an unauthenticated route
			let response = await request.get(`/unauthenticated`);
			let element = parseHtml(response.text, { rootElement: '.govuk-header' });

			expect(element.innerHTML).toMatchSnapshot();

			await signinWithGroups(['applications_case_team']);
			response = await request.get(`/unauthenticated`);
			element = parseHtml(response.text, { rootElement: '.govuk-header' });

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should destroy the msal token cache and session upon logging out', async () => {
			await signinWithGroups(['applications_case_team']);
			await request.get('/auth/signout');

			// access an authenticated route to determine if we're signed out
			const response = await request.get('/validation').redirects(1);

			expect(response.get('Location')).toEqual('/test/azure-msal/signin');
		});
	});

	describe('authorization', () => {
		it('should go the dashboard page when a user belongs to more than one group', async () => {
			await signinWithGroups(['applications_case_admin_officer', 'applications_case_team']);

			const response = await request.get('/');

			expect(response?.headers?.location).toEqual('/applications-service/');
		});

		describe('/applications-service/', () => {
			beforeEach(() => {
				nock('http://test/').get('/applications').reply(200, []);
			});

			it('should deny access to the domain if the user does not have permission', async () => {
				// @ts-ignore
				await signinWithGroups(['not_allowed_group_id']);

				const response = await request.get('/applications-service/').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual(
					'Sorry, there is a problem with your login'
				);
			});

			it('should permit access to the domain if the user has case-team permission', async () => {
				await signinWithGroups(['applications_case_team']);

				const response = await request.get('/applications-service');
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toContain('Applications');
			});

			it('should permit access to the domain if the user has inspector permission', async () => {
				await signinWithGroups(['applications_inspector']);

				const response = await request.get('/applications-service');
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toContain('Applications');
			});

			it('should permit access to the domain if the user has admin officer permission', async () => {
				await signinWithGroups(['applications_case_admin_officer']);

				const response = await request.get('/applications-service');
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toContain('Applications');
			});

			it('should redirect to the case officer page from the root path', async () => {
				await signinWithGroups(['applications_case_team']);

				const response = await request.get('/').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toContain('Applications');
			});
		});
	});
});

/** @returns {ConfidentialClientApplication} */
function getConfidentialClientApplication() {
	return /** @type {ConfidentialClientApplication} */ (
		azureMsalMock.confidentialClientApplications.last
	);
}

/** @typedef {'applications_case_admin_officer' | 'applications_case_team' | 'applications_inspector'} ApplicationsGroupId  */

/**
 * @param {Array<ApplicationsGroupId>} groups
 * @returns {Promise<void>}
 */
async function signinWithGroups(groups) {
	getConfidentialClientApplication().account = createAccountInfo({ groups });

	await request.get('/').redirects(1);
	await request.get(`/auth/redirect?code=msal_code`);
}
