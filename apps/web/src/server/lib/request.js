import got from 'got';

const request = {
	get: (url, options) => {
		return got.get(url, options);
	}
};

export {
	request
};
