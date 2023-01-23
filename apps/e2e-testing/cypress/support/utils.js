// @ts-nocheck
const fs = require('fs-extra');
const path = require('path');
const { BrowserAuthData } = require('../fixtures/browser-auth-data');

const getConfigByFile = (environmentName) => {
	const dir = path.join(__dirname, `../config/pins-${environmentName}.json`);
	let rawdata = fs.readFileSync(dir);
	return JSON.parse(rawdata);
};

const getCookiesFileContents = (userId   ) => {
	const fileName = path.join(__dirname, `/browserAuthData/${userId}-cookies.json`);
	return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

const cookiesFileExists = (userId) => {
	const fileName = path.join(__dirname, `/browserAuthData/${userId}-cookies.json`);
	return fs.existsSync(fileName);
};

const clearAllCookies = () => {
	const fileName = path.join(__dirname, '/browserAuthData');
	if (fs.existsSync(fileName)) {
		fs.rmSync(fileName, { recursive: true, force: true });
	}
	return fileName;
};

module.exports = { clearAllCookies, getConfigByFile, getCookiesFileContents, cookiesFileExists };
