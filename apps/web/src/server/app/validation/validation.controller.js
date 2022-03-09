import { findAllNewAppeals } from './validation.service.js';

/**
 * @func makeGovTableRow - given an item object transform it into
 * 						 - govuk/components/table/macro.njk" import govukTable format
 * @param item {any} todo
 * @returns {any} todo
 */
function makeGovTableRow(item){
	return [
		{ html: '<a href="#">'  + item.AppealReference + '</a>' },
		{ text: item.Received },
		{ text: item.AppealSite }
	];
}

async function getValidationDashboard(request, response) {

	const appealsListData = await findAllNewAppeals();

	const incompleteAppeals = [];
	const newAppeals = [];

	for (const item in appealsListData ) {
		if ( appealsListData[item].AppealStatus === 'incomplete'){
			incompleteAppeals.push(makeGovTableRow(appealsListData[item]));
		} else if ( appealsListData[item].AppealStatus === 'new'){
			newAppeals.push(makeGovTableRow(appealsListData[item]));
		}
	}

	const appealsList = {
		incompleteAppeals: incompleteAppeals,
		newAppeals: newAppeals
	};

	console.log(appealsList)

	response.render('validation/dashboard', {
		appealsList
	});
}


export {
	getValidationDashboard
};
