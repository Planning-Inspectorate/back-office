// @ts-nocheck
const fs = require('fs-extra');
const path = require('path');
const webpack = require('@cypress/webpack-preprocessor');

const clearAllCookies = () => {
	const fileName = path.join(__dirname, '/browserAuthData');
	if (fs.existsSync(fileName)) {
		fs.rmSync(fileName, { recursive: true, force: true });
	}
	return fileName;
};

const deleteFile = (fileName) => {
	fs.rmSync(path.join(__dirname, `../fixtures/${fileName}`), { recursive: true, force: true });
	return null;
};

const deleteDownloads = () => {
	fs.removeSync(path.join(__dirname, `../downloads`));
	return null;
};

const cookiesFileExists = (userId) => {
	const fileName = path.join(__dirname, `/browserAuthData/${userId}-cookies.json`);
	return fs.existsSync(fileName);
};

const getConfigByFile = (environmentName) => {
	const dir = path.join(__dirname, `../config/pins-${environmentName}.json`);
	let rawdata = fs.readFileSync(dir);
	return JSON.parse(rawdata);
};

const getCookiesFileContents = (userId) => {
	const fileName = path.join(__dirname, `/browserAuthData/${userId}-cookies.json`);
	return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

const webpackConfig = (config) =>
	webpack({
		webpackOptions: {
			resolve: {
				extensions: ['.ts', '.js']
			},
			module: {
				rules: [
					{
						test: /\.feature$/,
						use: [
							{
								loader: '@badeball/cypress-cucumber-preprocessor/webpack',
								options: config
							}
						]
					}
				]
			}
		}
	});

module.exports = {
	clearAllCookies,
	deleteFile,
	deleteDownloads,
	getConfigByFile,
	getCookiesFileContents,
	cookiesFileExists,
	webpackConfig
};
