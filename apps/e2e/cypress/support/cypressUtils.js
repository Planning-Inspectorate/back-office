// @ts-nocheck
const fs = require('fs-extra');
const path = require('path');

/**
 * Removes all cookies files stored in the 'browserAuthData' directory.
 * @returns {string} The path of the 'browserAuthData' directory.
 */
const clearAllCookies = () => {
	const fileName = path.join(__dirname, '/browserAuthData');
	if (fs.existsSync(fileName)) {
		fs.rmSync(fileName, { recursive: true, force: true });
	}
	return fileName;
};

/**
 * Checks if a cookies file exists for the given user ID and is still valid.
 * @param {string} userId - The user ID to check for.
 * @returns {boolean} True if the cookies file exists and is still valid, false otherwise.
 */
const cookiesFileExists = (userId) => {
	const fileName = path.join(__dirname, `browserAuthData/${userId}-cookies.json`);
	if (fileName.trim().length === 0) {
		return false;
	}

	if (!fs.existsSync(fileName)) {
		return false;
	}

	const fileStats = fs.statSync(fileName);
	const { ctimeMs } = fileStats;
	const maxAge = 15; // in minutes
	const ageInMinutes = (Date.now() - ctimeMs) / (1000 * 60);
	const isValid = ageInMinutes < maxAge;
	return isValid;
};

/**
 * Deletes all files and directories in the 'downloads' directory.
 * @returns {null}
 */
const deleteDownloads = () => {
	fs.removeSync(path.join(__dirname, `../downloads`));
	return null;
};

/**
 * Checks if a file exists in the downloads folder.
 *  * @param {string} fileName - The user ID to check for.
 * @returns {boolean}
 */
const validateDownloadedFile = (fileName) => {
	const downloadsPath = path.join(__dirname, `../downloads`);
	const filePath = path.join(downloadsPath, fileName);

	try {
		const stats = fs.statSync(filePath);
		return stats.isFile();
	} catch (err) {
		return false;
	}
};

/**
 * Deletes all files in the 'fixtures' directory that are not included in the keep list.
 * @returns {null}
 */
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

/**
 * Returns the contents of the configuration file for the given environment.
 * @param {string} environmentName - The name of the environment to get the configuration for.
 * @returns {object} The configuration object for the specified environment.
 */
const getConfigByFile = (environmentName) => {
	const dir = path.join(__dirname, `../config/pins-${environmentName}.json`);
	let rawdata = fs.readFileSync(dir);
	return JSON.parse(rawdata);
};

/**
 * Returns the contents of the cookies file for the given user ID.
 * @param {string} userId - The user ID to get the cookies for.
 * @returns {object} The contents of the cookies file for the specified user.
 */
const getCookiesFileContents = (userId) => {
	const fileName = path.join(__dirname, `/browserAuthData/${userId}-cookies.json`);
	return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

module.exports = {
	clearAllCookies,
	cookiesFileExists,
	getCookiesFileContents,
	deleteUnwantedFixtures,
	deleteDownloads,
	getConfigByFile,
	validateDownloadedFile
};
