import { representationDetailsFixture } from '../__fixtures__/representation-details.fixture.js';
import { getRepresentationDetailsViewModel } from '../application-representation-details.view-model.js';

describe('application representation details view-models', () => {
	describe('#representationsVieModel', () => {
		it('should return representation details mapped to the view model', () => {
			const response = getRepresentationDetailsViewModel(representationDetailsFixture);

			expect(response).toEqual({
				agentData: {
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
					county: '',
					postcode: 'BN14 0TT'
				},
				personData: {
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
					county: '',
					postcode: 'DT6 5RN'
				},
				representationData: {
					id: 1,
					reference: 'BC0110001-1',
					status: 'AWAITING_REVIEW',
					redacted: false,
					received: '27 Apr 2023',
					originalRepresentation:
						'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
					redactedRepresentation: '',
					representationExcerpt: ''
				},
				workflowData: {
					id: 1,
					reference: 'BC0110001-1',
					status: 'AWAITING_REVIEW',
					redacted: false,
					received: '2023-04-27T11:23:45.755Z',
					originalRepresentation:
						'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
					redactedRepresentation: null,
					user: null,
					contacts: [
						{
							type: 'PERSON',
							firstName: 'Mrs',
							lastName: 'Sue',
							organisationName: null,
							jobTitle: null,
							under18: false,
							email: 'test@example.com',
							phoneNumber: '01234 567890',
							address: {
								addressLine1: '44 Rivervale',
								addressLine2: null,
								town: 'Bridport',
								county: null,
								postcode: 'DT6 5RN'
							}
						},
						{
							type: 'AGENT',
							firstName: 'James',
							lastName: 'Bond',
							organisationName: '',
							jobTitle: null,
							under18: false,
							email: 'test-agent@example.com',
							phoneNumber: '01234 567890',
							address: {
								addressLine1: '8 The Chase',
								addressLine2: null,
								town: 'Findon',
								county: null,
								postcode: 'BN14 0TT'
							}
						}
					],
					attachments: [],
					redactedBy: null
				},
				attachmentsData: {
					id: 1,
					reference: 'BC0110001-1',
					status: 'AWAITING_REVIEW',
					redacted: false,
					received: '2023-04-27T11:23:45.755Z',
					originalRepresentation:
						'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
					redactedRepresentation: null,
					user: null,
					contacts: [
						{
							type: 'PERSON',
							firstName: 'Mrs',
							lastName: 'Sue',
							organisationName: null,
							jobTitle: null,
							under18: false,
							email: 'test@example.com',
							phoneNumber: '01234 567890',
							address: {
								addressLine1: '44 Rivervale',
								addressLine2: null,
								town: 'Bridport',
								county: null,
								postcode: 'DT6 5RN'
							}
						},
						{
							type: 'AGENT',
							firstName: 'James',
							lastName: 'Bond',
							organisationName: '',
							jobTitle: null,
							under18: false,
							email: 'test-agent@example.com',
							phoneNumber: '01234 567890',
							address: {
								addressLine1: '8 The Chase',
								addressLine2: null,
								town: 'Findon',
								county: null,
								postcode: 'BN14 0TT'
							}
						}
					],
					attachments: [],
					redactedBy: null
				}
			});
		});
	});
});
