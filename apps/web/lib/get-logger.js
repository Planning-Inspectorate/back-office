'use strict';

const { Signale } = require('signale');
const figures = require('figures');

module.exports = ({ scope }) =>
	new Signale({
		config: { displayTimestamp: true, underlineMessage: false, displayLabel: false },
		disabled: false,
		interactive: false,
		scope: scope ? scope : 'LTA',
		stream: [process.stdout],
		types: {
			error: { badge: figures.cross, color: 'red', label: '', stream: [process.stderr] },
			log: { badge: figures.info, color: 'magenta', label: '', stream: [process.stdout] },
			success: { badge: figures.tick, color: 'green', label: '', stream: [process.stdout] }
		}
	});
