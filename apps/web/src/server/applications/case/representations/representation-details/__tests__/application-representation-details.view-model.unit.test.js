// @ts-nocheck
import { representationDetailsFixture } from '../__fixtures__/representation-details.fixture.js';
import { getRepresentationDetailsViewModel } from '../application-representation-details.view-model.js';

describe('application representation details view-models', () => {
	describe('#representationDetailsViewModel', () => {
		const response = getRepresentationDetailsViewModel(representationDetailsFixture);

		it('should return representation details mapped to the agentData view model', () => {
			expect(response.agentData).toEqual({
				type: 'AGENT',
				orgName: '',
				name: 'James Bond',
				orgOrName: 'James Bond',
				jobTitle: '',
				under18: 'No',
				email: 'test-agent@example.com',
				phoneNumber: '01234 567890',
				preferredContact: '',
				addressLine1: '8 The Chase',
				addressLine2: '',
				town: 'Findon',
				postcode: 'BN14 0TT',
				country: 'Great Britain'
			});
		});

		it('should return representation details mapped to the represented view model', () => {
			expect(response.represented).toEqual({
				type: 'PERSON',
				orgName: '',
				name: 'Mrs Sue',
				orgOrName: 'Mrs Sue',
				jobTitle: '',
				under18: 'No',
				email: 'test@example.com',
				phoneNumber: '01234 567890',
				preferredContact: '',
				addressLine1: '44 Rivervale',
				addressLine2: '',
				town: 'Bridport',
				postcode: 'DT6 5RN',
				country: 'Great Britain'
			});
		});

		it('should return representation details mapped to the representationData view model', () => {
			expect(response.representationData).toEqual({
				id: 1,
				reference: 'BC0110001-1',
				status: 'AWAITING_REVIEW',
				redacted: true,
				type: 'mock type',
				redactedBy: 'mock redacted by',
				redactedNotes: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
				redactedNotesExcerpt: '',
				received: '27 Apr 2023',
				attachments: [
					{
						filename: 'a doc',
						id: 1,
						documentGuid: 'a doc guid'
					}
				],
				originalRepresentation:
					'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla con.',
				redactedRepresentation:
					'(Redacted) Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla con.',
				redactedRepresentationExcerpt:
					'(Redacted) Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu,',
				representationExcerpt:
					'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec'
			});
		});
	});
});
