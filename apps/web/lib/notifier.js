'use strict';

const notifier = require('node-notifier');

module.exports = {
	notify(message) {
		try {
			if (process.env.ENABLE_NOTIFIER === 'true') {
				notifier.notify({
					title: '🎾 LTA',
					message: message,
					icon: false
				});
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	}
};
