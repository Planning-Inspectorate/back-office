import { findAllNewAppeals } from './validation.service.js';

async function getValidationDashboard(request, response) {
	const appealsListData = await findAllNewAppeals();

	response.render('validation/dashboard', {
		appealsListData
	});
}

export {
	getValidationDashboard
};
