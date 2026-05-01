// @ts-nocheck
import { findAddressListByPostcode } from './findAddressListByPostcode.js';
import axios from 'axios';

const mockResponseAddresses = {
	data: {
		results: [
			{
				DPA: {
					UPRN: '100022933878',
					UDPRN: '8185441',
					ADDRESS: 'SOME ORGANISATION, 27, LIVERPOOL STREET, LONDON, EC2M 7PD',
					ORGANISATION_NAME: 'SOME ORGANISATION',
					BUILDING_NUMBER: '27',
					THOROUGHFARE_NAME: 'LIVERPOOL STREET',
					POST_TOWN: 'LONDON',
					POSTCODE: 'EC2M 7PD'
				}
			},
			{
				DPA: {
					UPRN: '1000229338001',
					UDPRN: '818000',
					ADDRESS: '11, SOME ROAD, LONDON, EC2M 7PD',
					BUILDING_NUMBER: '11',
					THOROUGHFARE_NAME: 'SOME ROAD',
					POST_TOWN: 'LONDON',
					POSTCODE: 'EC2M 7PD'
				}
			},
			{
				DPA: {
					UPRN: '100022966001',
					UDPRN: '816660',
					ADDRESS: '1A, OTHER ROAD, LONDON, EC2M 7PD',
					BUILDING_NAME: '1A',
					THOROUGHFARE_NAME: 'OTHER ROAD',
					POST_TOWN: 'LONDON',
					POSTCODE: 'EC2M 7PD'
				}
			},
			{
				DPA: {
					UPRN: '111111',
					UDPRN: '222222',
					ADDRESS: 'FLAT B, 39, TEST STREET, LONDON, EC2M 7PD',
					SUB_BUILDING_NAME: 'FLAT B',
					BUILDING_NUMBER: '39',
					THOROUGHFARE_NAME: 'TEST STREET',
					POST_TOWN: 'LONDON',
					POSTCODE: 'EC2M 7PD'
				}
			}
		]
	}
};

const formattedAddress = {
	addressList: [
		{
			addressLine1: '27 Liverpool Street ',
			addressLine2: 'Some Organisation ',
			apiReference: '100022933878_8185441',
			displayAddress: 'Some Organisation, 27, Liverpool Street, London, EC2M 7PD',
			postcode: 'EC2M 7PD',
			town: 'London '
		},
		{
			addressLine1: '11 Some Road ',
			addressLine2: '',
			apiReference: '1000229338001_818000',
			displayAddress: '11, Some Road, London, EC2M 7PD',
			postcode: 'EC2M 7PD',
			town: 'London '
		},
		{
			addressLine1: '1A Other Road ',
			addressLine2: '',
			apiReference: '100022966001_816660',
			displayAddress: '1a, Other Road, London, EC2M 7PD',
			postcode: 'EC2M 7PD',
			town: 'London '
		},
		{
			addressLine1: '39 Test Street ',
			addressLine2: 'Flat B ',
			apiReference: '111111_222222',
			displayAddress: 'Flat B, 39, Test Street, London, EC2M 7PD',
			postcode: 'EC2M 7PD',
			town: 'London '
		}
	]
};

describe('find address by postcode', () => {
	it('should return an error if apikey is not provided', async () => {
		const serviceResponse = await findAddressListByPostcode('EC2M 7PD');
		const expectedResult = {
			errors: { apiKey: { msg: 'An error occurred, please try again later' } }
		};

		expect(serviceResponse).toMatchObject(expectedResult);
	});

	it('should return an error if postcode is not valid', async () => {
		process.env.OS_PLACES_API_KEY = 'key';
		axios.get.mockResolvedValueOnce({});
		const serviceResponse = await findAddressListByPostcode('');
		const expectedResult = {
			errors: { postcode: { msg: 'Enter a valid postcode' } }
		};

		expect(serviceResponse).toMatchObject(expectedResult);
	});

	it('should return the address if the postcode exists', async () => {
		process.env.OS_PLACES_API_KEY = 'key';
		axios.get.mockResolvedValueOnce(mockResponseAddresses);
		const serviceResponse = await findAddressListByPostcode('EC2M 7PD');

		expect(serviceResponse).toMatchObject(formattedAddress);
	});
});
