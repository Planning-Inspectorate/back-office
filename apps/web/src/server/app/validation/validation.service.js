import request from './../../lib/request.js';

export async function findAllNewIncompleteAppeals() {
	const data = await request('validation');

	return data;
}

export async function findAppealById(id) {
	const data = await request(`validation/${id}`);

	let PlanningApplicationForm;
	let DecisionLetter;
	let AppealStatement;
	const SupportingDocuments = [];

	for (const doc of data.Documents) {
		switch (doc.Type) {
			case 'planning application form': {
				PlanningApplicationForm = { url: doc.URL, filename: doc.Filename };
				break;
			}
			case 'decision letter': {
				DecisionLetter = { url: doc.URL, filename: doc.Filename };
				break;
			}
			case 'appeal statement': {
				AppealStatement = { url: doc.URL, filename: doc.Filename };
				break;
			}
			default: {
				// Mostly supporting documents
				SupportingDocuments.push({ url: doc.URL, filename: doc.Filename });
			}
		}
	}

	data.PlanningApplicationForm = PlanningApplicationForm;
	data.DecisionLetter = DecisionLetter;
	data.AppealStatement = AppealStatement;
	data.SupportingDocuments = SupportingDocuments;

	return data;
}

export async function updateAppeal(id, data) {
	const result = await request.post(`validation/${id}`, {
		json: data
	});

	return result;
}
