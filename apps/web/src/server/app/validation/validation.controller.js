import { findAllNewAppeals } from './validation.service.js';

async function getValidationDashboard(request, response) {

	const appealsListData = await findAllNewAppeals();
	const incompleteAppeals = [];
	const newAppeals = [];

	// eslint-disable-next-line unicorn/no-array-for-each
	appealsListData.forEach( ( item, x , i ) => {
		const row = [
			{ html: '<a href="#">'  + item.AppealReference + '</a>' },
			{ text: item.Received },
			{ text: item.AppealSite }
		];
		if ( item.AppealStatus === 'incomplete'){
			incompleteAppeals.push(row);
		} else if ( item.AppealStatus === 'new'){
			newAppeals.push(row);
		}
	} );

	const appealsList = {
		incompleteAppeals: incompleteAppeals,
		newAppeals: newAppeals
	};

	response.render('validation/dashboard', {
		appealsList
	});
}

export {
	getValidationDashboard
};
