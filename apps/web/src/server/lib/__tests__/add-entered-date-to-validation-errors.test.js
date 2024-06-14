import addEnteredDatesToValidationErrors from '../add-entered-date-to-validation-errors.js';

describe('addEnteredDatesToValidationErrors', () => {
	it('Should populate validation errors for dates with entered value', () => {
		const enteredData = {
			title: '1234',
			'date.day': '01',
			'date.month': '110',
			'date.year': '24',
			description: 'xxxxx'
		};
		const validationErrors = {
			date: { msg: 'month is incorrect', value: undefined },
			description: { msg: 'should not be xxxxx', value: 'xxxxx' }
		};
		addEnteredDatesToValidationErrors(validationErrors, enteredData);
		expect(validationErrors).toEqual({
			date: {
				msg: 'month is incorrect',
				value: {
					day: '01',
					month: '110',
					year: '24'
				}
			},
			description: {
				msg: 'should not be xxxxx',
				value: 'xxxxx'
			}
		});
	});
});
