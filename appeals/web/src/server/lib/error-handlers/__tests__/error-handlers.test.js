import { errorAddressLine1, errorPostcode, errorTown } from '../address-error-handler.js';

describe('Address', () => {
	describe('First line error', () => {
		it('should return undefined if addressLine1 does not exist', () => {
			/** @type {import("@pins/express").ValidationErrors | undefined} */
			const errors = {
				town: { value: '', msg: 'Enter the town', param: 'town', location: 'body' },
				postCode: {
					value: '',
					msg: 'Enter postcode',
					param: 'postCode',
					location: 'body'
				}
			};
			expect(errorAddressLine1(errors)).toEqual(undefined);
		});
		it('should return error text if addressLine1 does exist', () => {
			/** @type {import("@pins/express").ValidationErrors | undefined} */
			const errors = {
				addressLine1: { value: '', msg: 'Enter the address', param: 'town', location: 'body' }
			};
			expect(errorAddressLine1(errors)).toEqual({
				text: 'Enter address line 1, typically the building and street'
			});
		});
	});
	describe('Town error', () => {
		it('should return undefined if town does not exist', () => {
			/** @type {import("@pins/express").ValidationErrors | undefined} */
			const errors = {
				addressLine1: { value: '', msg: 'Enter the address', param: 'town', location: 'body' }
			};
			expect(errorTown(errors)).toEqual(undefined);
		});
		it('should return error text if town does exist', () => {
			/** @type {import("@pins/express").ValidationErrors | undefined} */
			const errors = {
				town: { value: '', msg: 'Enter the town', param: 'town', location: 'body' }
			};
			expect(errorTown(errors)).toEqual({
				text: 'Enter town or city'
			});
		});
	});
	describe('Postcode error', () => {
		it('should return undefined if postCode does not exist', () => {
			/** @type {import("@pins/express").ValidationErrors | undefined} */
			const errors = {
				addressLine1: { value: '', msg: 'Enter the address', param: 'town', location: 'body' }
			};
			expect(errorPostcode(errors)).toEqual(undefined);
		});
		it('should return error text if postCode does exist', () => {
			/** @type {import("@pins/express").ValidationErrors | undefined} */
			const errors = {
				town: { value: '', msg: 'Enter the town', param: 'town', location: 'body' },
				postCode: {
					value: '',
					msg: 'Enter postcode',
					param: 'postCode',
					location: 'body'
				}
			};
			expect(errorPostcode(errors)).toEqual({
				text: 'Enter a valid postcode'
			});
		});
	});
});
