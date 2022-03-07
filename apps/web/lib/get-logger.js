import signale from 'signale';
import figures from 'figures';

export default ({ scope }) =>
	new signale.Signale({
		config: { displayTimestamp: true, underlineMessage: false, displayLabel: false },
		disabled: false,
		interactive: false,
		scope: scope ? scope : 'PI',
		stream: [process.stdout],
		types: {
			error: { badge: figures.cross, color: 'red', label: '', stream: [process.stderr] },
			log: { badge: figures.info, color: 'magenta', label: '', stream: [process.stdout] },
			success: { badge: figures.tick, color: 'green', label: '', stream: [process.stdout] },
			warn: { badge: figures.warning, color: 'orange', label: '', stream: [process.stdout] },
		}
	});
