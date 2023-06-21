import { representationDetailsFixture } from '../../__fixtures__/representation-details.fixture';

export const redactRepresentationFixture = {
	caseId: '1',
	representationId: '1',
	representationDetails: {
		...representationDetailsFixture
	},
	caseReference: {
		title: 'mock case reference title',
		status: 'AWAITING_REVIEW'
	}
};
