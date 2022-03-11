import { findAllNewAppeals } from './validation.service.js';

/**
 * Given an item object transform it into - govuk/components/table/macro.njk" import govukTable format
 *
 * @param {*} item to do
 * @returns {any} to do
 */
function makeGovTableRow(item){
	return [
		{ html: '<a href="#">'  + item.AppealReference + '</a>' },
		{ text: item.Received },
		{ text: item.AppealSite }
	];
}

/**
 * Main Route Entrey Point
 *
 * @param {*} request to do
 * @param {*} response to do
 * @returns {void} to do
 */
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

	response.render('validation/dashboard', {
		appealsList
	});
}


export {
	getValidationDashboard
};
