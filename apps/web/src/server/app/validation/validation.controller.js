import { to } from 'planning-inspectorate-libs';
import { findAllNewIncompleteAppeals } from './validation.service.js';

// Main Route entry point for Validation journey `/validation`.
// It will fetch the appeals list (new, incomplete) and will render all.
export async function getValidationDashboard(request, response, next) {
	let error, appealsListData;
	const newAppeals = [];
	const incompleteAppeals = [];

	// eslint-disable-next-line prefer-const
	[error, appealsListData] = await to(findAllNewIncompleteAppeals());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	// eslint-disable-next-line unicorn/no-array-for-each
	appealsListData.forEach((item) => {
		const row = [{ html: '<a href="#">' + item.AppealReference + '</a>' }, { text: item.Received }, { text: item.AppealSite }];

		if (item.AppealStatus === 'incomplete') {
			incompleteAppeals.push(row);
		} else if (item.AppealStatus === 'new') {
			newAppeals.push(row);
		}
	});

	response.render('validation/dashboard', {
		appealsList: {
			newAppeals,
			incompleteAppeals
		}
	});
}
