import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createAccountInfo, createTestApplication } from '../../../../../testing/index.js';
import { ConfidentialClientApplication, getMock } from '../../../../../testing/mocks/azure.js';

const { app, teardown } = createTestApplication({ authenticated: false });
const request = supertest(app);
const azureMsalMock = getMock();

describe('auth', () => {
	afterEach(teardown);

	describe('authentication', () => {
		it('should sign in an unauthenticated user via azure SSO', async () => {
			const response = await request.get('/validation').redirects(1);
			const client = /** @type {ConfidentialClientApplication} */ (
				azureMsalMock.confidentialClientApplications.last
			);

			// Assert azure msal client was instantiated correctly

			expect(client?.configuration.auth).toEqual({
				authority: 'auth_cloud_instance_id/auth_tenant_id',
				clientId: 'auth_client_id',
				clientSecret: 'auth_client_secret'
			});

			// Assert azure msal client's `getAuthCodeUrl` was invoked correctly

			const [authOptions] = /** @type {import('@azure/msal-node').AuthorizationUrlRequest[]} */ (
				client.getAuthCodeUrl.mock.lastCall
			);

			expect(authOptions.authority).toEqual('auth_cloud_instance_id/auth_tenant_id');
			expect(authOptions.redirectUri).toEqual(
				expect.stringMatching('^https?://.*/auth_redirect_uri')
			);
			expect(authOptions.scopes).toEqual(['user.read']);
			expect(authOptions.state).toBeTruthy();

			expect(response.get('Location')).toEqual('/test/azure-msal/signin');

			// Invoke the redirect from azure's SSO

			const redirect = await request.get(
				`/auth/redirect?code=azure_code&state=${authOptions.state}`
			);

			const [tokenOptions] = /** @type {import('@azure/msal-node').AuthorizationCodeRequest[]} */ (
				client.acquireTokenByCode.mock.lastCall
			);

			expect(tokenOptions.authority).toEqual('auth_cloud_instance_id/auth_tenant_id');
			expect(tokenOptions.redirectUri).toEqual(
				expect.stringMatching('^https?://.*/auth_redirect_uri')
			);
			expect(tokenOptions.scopes).toEqual(['user.read']);
			expect(tokenOptions.code).toEqual('azure_code');

			expect(redirect.get('Location')).toEqual('/validation');
		});

		it('should redirect to an error page when the azure redirect is incomplete', async () => {
			const response = await request.get(`/auth/redirect?code=azure_code`).redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to an error page when the azure redirect brings an unknown state', async () => {
			const response = await request.get(`/auth/redirect?code=azure_code&state=x`).redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to an error page when fetching the auth url fails', async () => {
			azureMsalMock.confidentialClientApplications.last?.getAuthCodeUrl.mockImplementationOnce(() =>
				Promise.reject(new Error('*'))
			);

			const response = await request.get(`/`).redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual(
				'Sorry, there is a problem with the service'
			);
		});
	});

	describe('authorization', () => {
		beforeEach(() => {
			nock('http://test/').get('/validation').reply(200, []);
		});

		describe('/validation', () => {
			it('should deny access to the domain if the user does not have permission', async () => {
				await signinWithGroups(['inspector', 'case_officer']);

				const response = await request.get('/validation').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual(
					'Sorry, there is a problem with your login'
				);
			});

			it('should permit access to the domain if the user has permission', async () => {
				await signinWithGroups(['validation_officer']);

				const response = await request.get('/validation');
				const element = parseHtml(response.text);

				console.log(element.innerHTML);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Appeal submissions for review');
			});

			it('should redirect to the validation page from the root path', async () => {
				await signinWithGroups(['validation_officer']);

				const response = await request.get('/').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Appeal submissions for review');
			});
		});

		describe('/lpa', () => {
			beforeEach(() => {
				nock('http://test/').get('/case-officer').reply(200, []);
			});

			it('should deny access to the domain if the user does not have permission', async () => {
				await signinWithGroups(['inspector', 'validation_officer']);

				const response = await request.get('/lpa').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual(
					'Sorry, there is a problem with your login'
				);
			});

			it('should permit access to the domain if the user has permission', async () => {
				await signinWithGroups(['case_officer']);

				const response = await request.get('/lpa');
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Questionnaires for review');
			});

			it('should redirect to the case officer page from the root path', async () => {
				await signinWithGroups(['case_officer']);

				const response = await request.get('/').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('Questionnaires for review');
			});
		});

		describe('/inspector', () => {
			beforeEach(() => {
				nock('http://test/').get('/inspector').reply(200, []);
			});

			it('should deny access to the domain if the user does not have permission', async () => {
				await signinWithGroups(['validation_officer', 'case_officer']);

				const response = await request.get('/inspector').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual(
					'Sorry, there is a problem with your login'
				);
			});

			it('should permit access to the domain if the user has permission', async () => {
				await signinWithGroups(['inspector']);

				const response = await request.get('/inspector');
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('My appeals');
			});

			it('should redirect to the inspector page from the root path', async () => {
				await signinWithGroups(['inspector']);

				const response = await request.get('/').redirects(1);
				const element = parseHtml(response.text);

				expect(element.querySelector('h1')?.innerHTML).toEqual('My appeals');
			});
		});

		it('should display the services page when a user belongs to more than one group', async () => {
			await signinWithGroups(['inspector', 'validation_officer', 'case_officer']);

			const response = await request.get('/');
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

/**
 * @param {Array<'validation_officer' | 'case_officer' | 'inspector'>} groups
 * @returns {Promise<void>}
 */
async function signinWithGroups(groups) {
	const client = /** @type {ConfidentialClientApplication} */ (
		azureMsalMock.confidentialClientApplications.last
	);

	client.acquireTokenByCode.mockReturnValueOnce(
		Promise.resolve(
			/** @type {import('@azure/msal-node').AuthenticationResult} */ ({
				account: createAccountInfo({ groups })
			})
		)
	);
	await request.get('/validation').redirects(1);

	const [{ state }] = /** @type {import('@azure/msal-node').AuthorizationUrlRequest[]} */ (
		client.getAuthCodeUrl.mock.lastCall
	);

	await request.get(`/auth/redirect?code=*&state=${state}`);
}
