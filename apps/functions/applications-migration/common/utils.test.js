import { getServiceUserUnder18AndCountyValue } from './utils';

describe('utils', () => {
	describe('getServiceUserUnder18AndCountyValue', () => {
		describe('when input is "under18"', () => {
			it('should return an object with under18 as true and county as null', () => {
				const result = getServiceUserUnder18AndCountyValue('under18');
				expect(result).toEqual({ under18: true, addressCounty: null });
			});
		});

		describe('when input is "over18"', () => {
			it('should return an object with under18 as false and county as null', () => {
				const result = getServiceUserUnder18AndCountyValue('over18');
				expect(result).toEqual({ under18: false, addressCounty: null });
			});
		});

		describe('when input is neither "under18" nor "over18"', () => {
			it('should return an object with under18 as null and county as the input value', () => {
				const result = getServiceUserUnder18AndCountyValue('some other value');
				expect(result).toEqual({ under18: null, addressCounty: 'some other value' });
			});
		});

		describe('when input is null', () => {
			it('should return an object with under18 as null and county as null', () => {
				const result = getServiceUserUnder18AndCountyValue(null);
				expect(result).toEqual({ under18: null, addressCounty: null });
			});
		});
	});
});
