import notifier from 'node-notifier';
import { loadEnvironment } from 'planning-inspectorate-libs';

loadEnvironment(process.env.NODE_ENV);

// Disabled because it adds a lag to the local dev pipeline
// eslint-disable-next-line max-len, no-constant-condition
const notify = false && process.env.ENABLE_NOTIFIER === 'true' ? (message) => notifier.notify({ title: '🏢 PI', message, icon: false, wait: false }) : () => {};

export {
	notify
};
