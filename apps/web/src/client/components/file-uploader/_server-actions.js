// TODO: all of this is just a mock meant to define the general structure

// TODO: change this name
export const preBlobStorage = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(1);
		}, 1000);
	});
};
