// @ts-nocheck
import { Logger } from './logger.js';

export class MochaLogger extends Logger {
	start(mocha) {
		const start = `${mocha.currentTest.title} starts at ${new Date().toISOString()}`;

		this.log('cyan', start);
	}

	end(mocha) {
		const { state, title } = mocha.currentTest;
		const statusColor = state === 'passed' ? 'green' : 'red';
		const end = `${title} ends at ${new Date().toISOString()}`;

		this.log('cyan', end);
		this.log(statusColor, `Outcome: ${state}`);
	}

	suite(mocha) {
		this.log('yellow', `[Test suite:] ${mocha.test.parent.title}`);
	}
}
