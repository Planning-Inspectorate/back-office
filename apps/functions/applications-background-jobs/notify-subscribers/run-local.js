import runFunc from './index.js';
import { docopt } from 'docopt';

const usage = `
Usage:
  run-local <update-id> <case-reference>
`;

async function run() {
	const args = docopt(usage, { version: '1.0.0' });
	const updateId = parseInt(args['<update-id>']);
	const caseReference = args['<case-reference>'];
	if (isNaN(updateId)) {
		console.log(usage);
		return;
	}

	console.log('running with options', { updateId, caseReference });

	const log = () => console.log;
	log.warn = console.error;
	log.error = console.error;
	log.info = console.log;
	log.verbose = console.log;

	await runFunc(
		{
			log,
			invocationId: 'invoc-1'
		},
		{
			caseReference,
			id: updateId,
			updateContentEnglish: 'My Update',
			updateStatus: 'published'
		}
	);
}

run().catch(console.error);
