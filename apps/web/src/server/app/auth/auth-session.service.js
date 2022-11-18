/** @typedef {import('express-session').Session & AuthState} SessionWithAuth */
/** @typedef {import('./auth.service').AccountInfo} AccountInfo */
/** @typedef {import('@pins/platform').MsalAuthenticationResult} MsalAuthenticationResult */

/**
 * @typedef {object} AuthenticationData
 * @property {string} nonce
 * @property {string} postSigninRedirectUri
 */

/**
 * @typedef {object} AuthState
 * @property {AccountInfo=} account
 * @property {AuthenticationData=} authenticationData
 */

/**
 * @param {SessionWithAuth} session
 * @returns {void}
 */
export const destroyAuthenticationData = (session) => {
	delete session.authenticationData;
};

/**
 * @param {SessionWithAuth} session
 * @returns {AuthenticationData}
 */
export const getAuthenticationData = (session) => {
	if (session.authenticationData) {
		return session.authenticationData;
	}
	throw new Error('Authentication does not exist.');
};

/**
 * @param {SessionWithAuth} session
 * @param {AuthenticationData} data
 * @returns {void}
 */
export const setAuthenticationData = (session, data) => {
	session.authenticationData = data;
};

/**
 * @param {SessionWithAuth} session
 * @returns {void}
 */
export const destroyAccount = (session) => {
	delete session.account;
};

/**
 * @param {SessionWithAuth} session
 * @param {MsalAuthenticationResult} authenticationResult
 * @returns {void}
 */
export const setAccount = (session, authenticationResult) => {
	const { account, accessToken, idToken, expiresOn } = authenticationResult;

	session.account = {
		...account,
		accessToken,
		idToken,
		expiresOnTimestamp: expiresOn?.getTime()
	};
};

/**
 * @param {SessionWithAuth} session
 * @returns {AccountInfo=}
 */
export const getAccount = (session) => {
	// todo: remove mocked accesttoken
	const mockedAccessToken = {
		accessToken:
			'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImdIdWd1YjYtU2VOc2FMUWJpaXVtYnFyQ0ZPSW9xbXZsN0VMSV9VS3NnWTAiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81ODc4ZGY5OC02Zjg4LTQ4YWItOTMyMi05OThjZTU1NzA4OGQvIiwiaWF0IjoxNjY4NzczMzc1LCJuYmYiOjE2Njg3NzMzNzUsImV4cCI6MTY2ODc3ODU5OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQXBPVDJEUWRmZk8xVXBwRmtUNk4xUlJmSklyakhDNlZieEtYSSttRG9JNVhvbmExckdHYlFDdE1veUZRQnVrR1J2Qi9TMFg5eDJNcTFWajZKVXFSTEFHaEdscmZ4WlJHdWRvMnZCaEF6QWFvPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQmFjayBPZmZpY2UgRGV2IiwiYXBwaWQiOiI3Y2FiODk3MS1jMzA1LTRiOWEtODJkYi0yMWI1ZmQ4NGVmYmQiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IlRhbWlnaW8iLCJnaXZlbl9uYW1lIjoiTHVkb3ZpY28iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI5MC4yMDMuODcuMTczIiwibmFtZSI6IlRhbWlnaW8sIEx1ZG92aWNvIiwib2lkIjoiZDI2ZTY3YjctMmNkYS00NDZiLWJkMzAtNDZiYzM0NGJkMzk2IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAyMDZBQkNCNTciLCJyaCI6IjAuQVRFQW1OOTRXSWh2cTBpVElwbU01VmNJalFNQUFBQUFBQUFBd0FBQUFBQUFBQUF4QU00LiIsInNjcCI6ImVtYWlsIEdyb3VwTWVtYmVyLlJlYWQuQWxsIG9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCIsInN1YiI6InFPelFFXzJiYVlVcU9BV2paYnZvZUdLOHpsRmxfcmYzZEktcnVYQ0w5anMiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiI1ODc4ZGY5OC02Zjg4LTQ4YWItOTMyMi05OThjZTU1NzA4OGQiLCJ1bmlxdWVfbmFtZSI6Ikx1ZG92aWNvLlRhbWlnaW9AcGxhbm5pbmdpbnNwZWN0b3JhdGUuZ292LnVrIiwidXBuIjoiTHVkb3ZpY28uVGFtaWdpb0BwbGFubmluZ2luc3BlY3RvcmF0ZS5nb3YudWsiLCJ1dGkiOiJBMVVTd0JQeXJrcUdjYmtGeTVVeEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6Ilc1YzB0RWJrbkc4a0JFbXppRHR3Q3JZWWxEWXZQSVRMclQyZnAzSkVlVFEifSwieG1zX3RjZHQiOjE1MjAyNjg3OTd9.f96Mh1MR1bQAclMv_K8h0-DDtU_EfdZAqW_R-omIeXExzq51zQc8IFS28WrRop0KTQfwPNsRJquvDvCYPUQkq_oTsLt7_WoGDj6Bw2bzN1zsK1Kj9nHzYtqiXtOzycf5ev_Qu-JzxDwBL1fu0z_fMg3t2HshFHV3jW-sjMgYLK-0TfbDDKLGAvrOqqHJVZr3h6z0rIzLqqQH5FsP25ES_uBOra9vAwCLivmWlR7sxoSH0GOtw01eGuQnWTax20gYz7Wrvl91nduCDqCexnniyJFxTko5ZMEegmOqhW_P65w5ZPfbRtM168pEq9VNl_0BXc_blPOdxgjQPdFcewxK0w',
		expiresOnTimestamp: 1_668_778_598_000_000_000
	};

	return session.account ? { ...session.account, ...mockedAccessToken } : session.account;
};
