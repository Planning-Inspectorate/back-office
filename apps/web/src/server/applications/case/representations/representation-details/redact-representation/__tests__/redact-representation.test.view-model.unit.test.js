import { redactRepresentationFixture } from '../__fixtures__/redact-representation.fixture.js';
import { getRedactRepresentationViewModel } from '../redact-representation.view-model.js';

describe('redact-representation view-models', () => {
	describe('#getRedactRepresentationViewModel', () => {
		const { caseId, representationId, representationDetails, caseReference } =
			redactRepresentationFixture;
		const response = getRedactRepresentationViewModel(
			caseId,
			representationId,
			{ ...representationDetails },
			caseReference.title,
			caseReference.status
		);
		it('should return the redact representation view model', () => {
			expect(response).toEqual({
				backLinkUrl:
					'/applications-service/case/1/relevant-representations/1/representation-details',
				caseId: '1',
				originalRepresentation:
					'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla con.',
				projectName: 'mock case reference title',
				representationId: '1',
				statusText: 'AWAITING_REVIEW',
				redactedRepresentation:
					'(Redacted) Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla con.',
				notes: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
				redactedBy: 'mock redacted by'
			});
		});
	});
});
