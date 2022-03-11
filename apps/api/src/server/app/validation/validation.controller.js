const appealsList = [
	{
		AppealId: 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		AppealStatus: 'new',
		Received: '23 Feb 2022',
		AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY'
	},
	{
		AppealId: 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		AppealStatus: 'incomplete',
		Received: '25 Feb 2022',
		AppealSite: '55 Butcher Street, Thurnscoe, S63 0RB'
	}
];

const appealReview =
	{
		AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		AppellantName: 'Lee Thornton',
		AppealStatus:'new',
		Received: '23 Feb 2022',
		AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
		LocalPlanningDepartment: 'Maindstone Borough Council',
		PlanningApplicationReference: '48269/APP/2021/1482'
	};

const getAppealReview  = function (request, response) {
	response.send(appealReview);
};

const getValidation = function (request, response) {
	response.send(appealsList);
};

const updateValidation = function (request, response) {
	response.send();
};

export { getValidation, getAppealReview, updateValidation };
