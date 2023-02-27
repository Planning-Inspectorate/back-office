// @ts-nocheck
import { BrowserAuthData } from '../fixtures/browser-auth-data';
import { projectInformation } from './utils/createProjectInformation';

Cypress.Commands.add('clearCookiesFile', () => {
	cy.task('ClearAllCookies').then((cleared) => {
		console.log(cleared);
	});
});

Cypress.Commands.add('loginWithPuppeteer', (user) => {
	var config = {
		username: user.email,
		password: Cypress.env('PASSWORD'),
		loginUrl: Cypress.config('baseUrl'),
		id: user.id
	};

	cy.task('AzureSignIn', config).then((cookies) => {
		cy.clearCookies({ log: false });
		cookies.forEach((cookie) => {
			cy.setCookie(cookie.name, cookie.value, {
				domain: cookie.domain,
				expiry: cookie.expires,
				httpOnly: cookie.httpOnly,
				path: cookie.path,
				secure: cookie.secure,
				log: false
			});
		});
	});

	return;
});

Cypress.Commands.add('login', (user) => {
	cy.task('CookiesFileExists', user.id).then((exists) => {
		if (!exists) {
			cy.loginWithPuppeteer(user);
		} else {
			cy.task('GetCookiesFileContents', user.id).then((fileContents) => {
				const expiry = fileContents[fileContents.length - 1]['expires'];
				const now = Math.floor(Date.now() / 1000);
				const tokenIsValid = expiry > now + 1200;

				if (!tokenIsValid) {
					cy.loginWithPuppeteer(user);
				} else {
					setLocalCookies(user.id);
				}
			});
		}
	});
});

Cypress.Commands.add('createProjectInformation', (fileOne, fileTwo) => {
	const p1 = JSON.stringify(projectInformation());
	const p2 = JSON.stringify(projectInformation());
	cy.writeFile(`./cypress/fixtures/${fileOne}`, p1);
	cy.writeFile(`./cypress/fixtures/${fileTwo}`, p2);
});

Cypress.Commands.add('deleteFile', (files) => {
	files.map((file) => {
		cy.task('DeleteFile', file);
	});
});

export function setLocalCookies(userId) {
	cy.readFile(
		`${BrowserAuthData.BrowserAuthDataFolder}/${userId}-${BrowserAuthData.CookiesFile}`
	).then((data) => {
		cy.clearCookies({ log: false });
		data.forEach((cookie) => {
			cy.setCookie(cookie.name, cookie.value, {
				domain: cookie.domain,
				expiry: cookie.expires,
				httpOnly: cookie.httpOnly,
				path: cookie.path,
				secure: cookie.secure,
				log: false
			});
		});
	});
}
