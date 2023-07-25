import { mapRepToCsv } from '../utils/map-rep-to-csv.js';

describe('Map Application Representation Download', () => {
	it('should map with empty value if data missing', () => {
		const response = mapRepToCsv([
			{
				reference: '1234',
				type: 'VALID',
				contacts: [
					{
						address: {}
					},
					{ address: {} }
				]
			}
		]);
		expect(response).toEqual('1234,,, , ,,,,,,\n');
	});
	it('should map the first element if the second element (agent) is not in the contacts array', () => {
		const response = mapRepToCsv([
			{
				reference: '1234',
				type: 'VALID',
				contacts: [
					{
						type: 'PERSON',
						organisationName: 'an org',
						email: 'an email',
						address: {
							addressLine1: 'line 1',
							addressLine2: 'line 2',
							town: 'a town',
							country: ' a country',
							postcode: 'a post code'
						}
					}
				]
			}
		]);
		// Expect csv to have the data for the type other than person
		expect(response).toEqual(
			'1234,,an email,an org,line 1 line 2,a town, a country,,,a post code,\n'
		);
	});
	it('should map the second element in the array if present (and use the first element for the "On behalf of")', () => {
		const response = mapRepToCsv([
			{
				reference: '1234',
				type: 'VALID',
				contacts: [
					{
						type: 'PERSON',
						firstName: 'first name',
						lastName: 'last name',
						email: 'an email',
						address: {
							addressLine1: 'line 1',
							addressLine2: 'line 2',
							town: 'a town',
							country: ' a country',
							postcode: 'a post code'
						}
					},
					{
						type: 'AGENT',
						organisationName: 'agent org',
						email: 'agent email',
						address: {
							addressLine1: 'agent line 1',
							addressLine2: 'agent line 2',
							town: 'agent town',
							country: 'agent country',
							postcode: 'agent post code'
						}
					}
				]
			}
		]);
		expect(response).toEqual(
			'1234,first name last name,agent email,agent org,agent line 1 agent line 2,agent town,agent country,,,agent post code,\n'
		);
	});
});
