// Run book for Delivering CBOS To Azure Test Environment

// @ts-nocheck
const readline = require('readline');

const steps = [
	{
		instruction: 'Notify developers not to merge PRs into main.',
		links: {},
		prompt: 'Press enter when done: '
	},
	{
		instruction:
			'Run the E2E tests against DEV from localhost when a PR is merged or before initiating the Release process.',
		links: {},
		prompt: 'Did they pass? (y/N): ',
		failMsg: 'Address failing E2E tests before continuing.'
	},
	{
		instruction: 'Confirm from testers that it is OK to deliver to Test.',
		links: {},
		prompt: 'Press enter when done: '
	},
	{
		instruction: 'Approve the most recent DEV deployment for TEST.',
		links: {
			'Deployment pipeline':
				'https://dev.azure.com.mcas.ms/planninginspectorate/back-office/_build?definitionId=130'
		},
		prompt: 'Was it green? (y/N): ',
		failMsg: 'Address failed deployment before continuing.'
	},
	{
		instruction: 'Run the E2E tests against TEST with flags ON.',
		links: {
			'Test pipeline':
				'https://dev.azure.com.mcas.ms/planninginspectorate/back-office/_build?definitionId=159',
			'Feature flags':
				'https://portal.azure.com.mcas.ms/#@planninginspectorate.gov.uk/resource/subscriptions/76cf28c6-6fda-42f1-bcd9-6d7dbed704ef/resourceGroups/pins-rg-back-office-test-ukw-001/providers/Microsoft.AppConfiguration/configurationStores/pins-asc-bo-test-ukw-001/ff'
		},
		prompt: 'Did they pass? (y/N): ',
		failMsg: 'Address failing E2E tests before continuing.'
	},
	{
		instruction:
			'Confirm from testers that it is OK to turn off Feature Flags for 2nd Regression test.',
		links: {},
		prompt: 'Press enter when done: '
	},
	{
		instruction: 'Run the E2E tests against TEST with flags OFF.',
		links: {
			'Test pipeline':
				'https://dev.azure.com.mcas.ms/planninginspectorate/back-office/_build?definitionId=159',
			'Feature flags':
				'https://portal.azure.com.mcas.ms/#@planninginspectorate.gov.uk/resource/subscriptions/76cf28c6-6fda-42f1-bcd9-6d7dbed704ef/resourceGroups/pins-rg-back-office-test-ukw-001/providers/Microsoft.AppConfiguration/configurationStores/pins-asc-bo-test-ukw-001/ff'
		},
		prompt: 'Did they pass? (y/N): ',
		failMsg: 'Address failing E2E tests before continuing.'
	},
	{
		instruction: 'Turn flags back ON.',
		links: {
			'Feature flags':
				'https://portal.azure.com.mcas.ms/#@planninginspectorate.gov.uk/resource/subscriptions/76cf28c6-6fda-42f1-bcd9-6d7dbed704ef/resourceGroups/pins-rg-back-office-test-ukw-001/providers/Microsoft.AppConfiguration/configurationStores/pins-asc-bo-test-ukw-001/ff'
		},
		prompt: 'Press enter when done: '
	},
	{
		instruction: 'Notify all successful delivery to Test - OK to use.',
		links: {},
		prompt: 'Press enter when done: '
	},
	{
		instruction:
			"Move tickets in 'Ready for release to test' to 'Ready for test' and set 'CBOS-next' as their fix version, and tag the release number in the comments.",
		links: {
			'JIRA board': 'https://pins-ds.atlassian.net/jira/software/c/projects/APPLICS/boards/242'
		},
		prompt: 'Press enter when done: '
	},
	{
		instruction: 'Add the build number to the list of Release Candidates.',
		links: {
			'Confluence Release Candidates':
				'https://pins-ds.atlassian.net/wiki/spaces/AS2/pages/1677000733/Release+candidates'
		},
		prompt: 'Press enter when done: '
	}
];

function runStep(index) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const step = steps[index];
	const links = Object.keys(step.links).reduce(
		(acc, key) => `\x1b[1m${acc}${key}:\x1b[22m ${step.links[key]}\n`,
		''
	);
	const fullText = `${index + 1}: ${step.instruction}\n${links}\n${step.prompt}`;

	return new Promise((resolve) =>
		rl.question(fullText, (response) => {
			rl.close();

			if (!step.failMsg) {
				resolve(true);
				return;
			}

			const passed = response.toLowerCase() === 'y';
			if (!passed) {
				process.stdout.write(`${step.failMsg}\n\n`);
				resolve(false);
				return;
			}

			process.stdout.write('Done.\n\n');
			resolve(true);
		})
	);
}

async function run() {
	process.stdout.write('\nRun book for Delivering CBOS To Azure Test Environment');
	process.stdout.write('\n======================================================\n\n');

	for (const indexStr in steps) {
		const index = Number(indexStr);

		const passed = await runStep(index);
		if (!passed) {
			break;
		}

		if (index === steps.length - 1) {
			process.stdout.write('\nDone.\n\n');
		}
	}
}

run();
