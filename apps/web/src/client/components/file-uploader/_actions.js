// TODO: all of this is just a mock meant to define the general structure

/**
 * todo
 *
 * @param {*} uploadInput
 */
export const preValidation = async (uploadInput) => {
	const filesToUpload = uploadInput.files;

	return new Promise((resolve, reject) => {
		let filesSize = 0;

		for (const file of filesToUpload) {
			filesSize += file.size;
		}
		if (filesSize > 1000) {
			reject(new Error('SIZE_EXCEDEED'));
		}

		resolve(1);
	});
};

// TODO: change this name
export const preBlobStorage = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(1);
		}, 1000);
	});
};
