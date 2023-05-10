// @ts-nocheck
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { BrowserAuthData } = require('../fixtures/browser-auth-data');

const locators = {
	usernameInput: 'input[name=loginfmt]',
	passwordInput: 'input[name=passwd]',
	pinsApplicationHeader: '#pins-applications-header'
};

const timeout = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

azureSignIn = async (config) => {
	const browser = await puppeteer.launch({
		headless: 'new',
		ignoreHTTPSErrors: true,
		args: ['--no-sandbox', '--ignore-certificate-errors']
	});

	const page = await browser.newPage();
	await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 0 });
	await page.waitForSelector(locators.usernameInput, { visible: true, timeout: 10000 });
	await page.type(locators.usernameInput, config.username);
	await page.keyboard.press('Enter');
	await page.waitForSelector(locators.passwordInput, { visible: true, timeout: 10000 });
	await timeout(2000);
	await page.type(locators.passwordInput, config.password);
	await page.keyboard.press('Enter');
	await timeout(5000);

	const cookies = await getCookies(page);

	if (!fs.existsSync(BrowserAuthData.BrowserAuthDataFolder)) {
		fs.mkdirSync(BrowserAuthData.BrowserAuthDataFolder);
	}
	fs.writeFileSync(
		path.resolve(
			BrowserAuthData.BrowserAuthDataFolder,
			`${config.id}-${BrowserAuthData.CookiesFile}`
		),
		JSON.stringify(cookies)
	);

	await browser.close();
	return cookies;
};

async function getCookies(page) {
	const response = await page._client().send('Network.getAllCookies');
	return response.cookies;
}

module.exports = { azureSignIn };
