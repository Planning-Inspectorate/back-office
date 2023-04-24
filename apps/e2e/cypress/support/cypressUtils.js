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

const deleteUnwantedFixtures = () => {
	const folderPath = path.join(__dirname, '../fixtures');
	const keepList = [
		'browser-auth-data.js',
		'case-search.json',
		'folder-structure.json',
		'sample-doc.pdf',
		'sample-file.doc',
		'sample-img.gif',
		'sample-img.jpeg',
		'sample-img.jpg',
		'sample-video.mp4',
		'users.js',
		'test.pdf'
	];
	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error(err);
			return;
		}

		files.forEach((file) => {
			if (!keepList.includes(file)) {
				fs.unlink(`${folderPath}/${file}`, (err) => {
					if (err) {
						console.error(err);
						return;
					}
					console.log(`Deleted ${file}`);
				});
			}
		});
	});

	return null;
};

module.exports = {
	clearAllCookies,
	deleteUnwantedFixtures,
	deleteDownloads,
	getConfigByFile,
	getCookiesFileContents,
	cookiesFileExists
};
