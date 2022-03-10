import { findAllNewAppeals } from './validation.service.js';

async function getValidationDashboard(request, response, next) {
	try {
		const appealsListData = [];await findAllNewAppeals();

		response.render('validation/dashboard', {
			appealsListData
		});
	} catch (error) {
		next(new Error(error));
	}
}

export {
	getValidationDashboard
};
