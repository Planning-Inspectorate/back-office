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

azureSignIn = async (config) => {
	const browser = await puppeteer.launch({
		headless: false,
		ignoreHTTPSErrors: true,
		args: ['--no-sandbox', '--ignore-certificate-errors']
	});

	const page = await browser.newPage();
	await page.goto(config.loginUrl, { timeout: 60000 });
	await page.waitForSelector(locators.usernameInput, { timeout: 60000 });
	await page.type(locators.usernameInput, config.username);
	await page.keyboard.press('Enter');
	await page.waitForSelector(locators.passwordInput, { visible: true });
	await page.waitForTimeout(1000);
	await page.type(locators.passwordInput, config.password);
	await page.keyboard.press('Enter');
	await page.waitForTimeout(2000);
	await page.waitForSelector(locators.pinsApplicationHeader, { visible: true, timeout: 10000 });
	await page.click(locators.pinsApplicationHeader);

	const tokenValues = await page.evaluate(() => {
		let values = {};
		for (let index = 0, length = localStorage.length; index < length; ++index) {
			values[localStorage.key(index)] = localStorage.getItem(localStorage.key(index));
		}
		return values;
	});
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
