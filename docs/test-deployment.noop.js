const readline = require('readline');

const steps = [
	{
		instruction: 'Run the E2E tests against DEV.',
		links: {
			'Test pipeline':
				'https://dev.azure.com.mcas.ms/planninginspectorate/back-office/_build?definitionId=159'
		},
		prompt: 'Did they pass? (y/N): ',
		failMsg: 'Address failing E2E tests before continuing.'
	},
	{
		instruction: 'Approve the most recent deployment DEV deployment for test.',
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
		instruction:
			"Move tickets in 'Ready for release to test' to 'Ready for test' and set 'CBOS-next' as their fix version.",
		links: {
			'JIRA board': 'https://pins-ds.atlassian.net/jira/software/c/projects/APPLICS/boards/242'
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
		(acc, key) => `${acc}${key}: ${step.links[key]}\n`,
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
