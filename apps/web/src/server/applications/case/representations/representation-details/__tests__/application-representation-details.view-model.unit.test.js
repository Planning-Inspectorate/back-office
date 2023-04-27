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
					prefferedContact: '',
					addressLine1: '96 The Avenue',
					addressLine2: 'Maidstone',
					town: '',
					county: 'Kent',
					postcode: 'MD21 5XY'
				},
				personData: {
					orgName: '',
					name: 'Arthur Test',
					orgOrName: 'Arthur Test',
					jobTitle: '',
					under18: 'No',
					email: 'test@example.com',
					phoneNumber: '01234 567890',
					prefferedContact: '',
					addressLine1: '21 The Pavement',
					addressLine2: '',
					town: '',
					county: 'Wandsworth',
					postcode: 'SW4 0HY'
				},
				representationData: {
					id: 1,
					reference: 'BC0110001-3',
					status: 'VALID',
					redacted: true,
					received: '14 Apr 2023',
					originalRepresentation:
						'Ipsum ex deserunt et consequat esse reprehenderit excepteur ipsum eu. Ea sit Lorem irure duis pariatur sit ea est ut magna. Elit in ea sint reprehenderit anim aute ullamco laboris enim adipisicing elit tempor.',
					redactedRepresentation:
						'The proposals size, loss of food producing land, battery storage size and technology, joined up thinking between DCO applications',
					representationExcerpt:
						'Ipsum ex deserunt et consequat esse reprehenderit excepteur ipsum eu. Ea sit Lorem irure duis pariatur sit ea est ut magna. Elit in ea sint reprehenderit anim aute ullamco laboris enim adipisicing...'
				},
				workflowData: false,
				attachmentsData: false
			});
		});
	});
});
