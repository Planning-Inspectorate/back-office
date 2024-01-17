// @ts-nocheck
// import run from '../';
import api from '../back-office-api-client';
import { jest } from '@jest/globals';
import fn from '../index.js';

const message = {
	referenceId: 'BC0110002-091222133021123',
	caseReference: 'BC0110002',
	originalRepresentation: 'this is the representation',
	represented: {
		firstName: 'Joe',
		lastName: 'Bloggs',
		type: 'PERSON',
		under18: false,
		contactMethod: undefined,
		email: 'joe@example.org',
		phoneNumber: '07700900000',
		address: {
			addressLine1: '123 Some Street',
			addressLine2: 'Kings Cross',
			town: 'London',
			postcode: 'N1 9BE',
			country: 'England'
		}
	},
	representative: {
		firstName: 'Bob',
		lastName: 'Jones',
		type: 'PERSON',
		under18: false,
		contactMethod: undefined,
		email: 'bob@example.org',
		phoneNumber: '07700900001',
		address: {
			addressLine1: '123 Some Road',
			addressLine2: '',
			town: 'Edinburgh',
			postcode: 'EH1 1AA',
			country: 'Scotland'
		}
	},
	representationType: 'Members of the Public/Businesses',
	dateReceived: '2023-02-01T00:00:00.000Z'
};

const now = 1_675_209_600_000;

jest.useFakeTimers({ now });

describe('register-representation-command', () => {
	beforeEach(() => {
		api.getCaseID = jest.fn().mockResolvedValueOnce(1);
		api.postRepresentation = jest.fn().mockResolvedValueOnce({});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	const mockContext = { log: jest.fn() };

	test('Success', async () => {
		await fn(mockContext, message);

		expect(api.getCaseID).toHaveBeenCalledWith('BC0110002');
		expect(api.postRepresentation).toHaveBeenCalledWith(1, {
			reference: 'BC0110002-091222133021123',
			type: 'Members of the Public/Businesses',
			originalRepresentation: 'this is the representation',
			represented: message.represented,
			representative: message.representative,
			representedType: 'AGENT',
			received: '2023-02-01T00:00:00.000Z'
		});
	});
});
