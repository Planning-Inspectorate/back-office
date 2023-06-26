import { addressToString } from '../address-formatter.js';
import asyncRoute from '../async-route.js';
import { bodyToPayload } from '../body-formatter.js';
import { dateIsValid, isDateInstance } from '../dates.js';
import { appealShortReference } from '../nunjucks-filters/appeals.js';
import { datestamp, displayDate } from '../nunjucks-filters/date.js';
import { generateSummaryList } from '../nunjucks-template-builders/summary-list-builder.js';
import { nameToString } from '../person-name-formatter.js';

describe('Libraries', () => {
	describe('addressFormatter', () => {
		it('should converts a multi part address to a single string', () => {
			const address = {
				postCode: 'postcode',
				addressLine1: 'address 1',
				addressLine2: 'address 2',
				town: 'town'
			};

			const adressFormatted = addressToString(address);

			expect(typeof adressFormatted).toBe('string');
		});
	});

	describe('appeals', () => {
		describe('appealShortRef', () => {
			const tests = [
				{
					name: 'null',
					ref: null,
					want: null
				},
				{
					name: 'undefined'
				},
				{
					name: 'empty',
					ref: '',
					want: ''
				},
				{
					name: 'invalid',
					ref: 'APP/5141/9999',
					want: 'APP/5141/9999'
				},
				{
					name: 'valid 1',
					ref: 'APP/Q9999/D/21/1345264',
					want: '1345264'
				},
				{
					name: 'valid 2',
					ref: 'APP/Q9999/D/21/5463281',
					want: '5463281'
				}
			];

			for (const { name, ref, want } of tests) {
				it(`should handle ${name}`, () => {
					const got = appealShortReference(ref);

					expect(got).toEqual(want);
				});
			}
		});
		describe('summary-list-builder', () => {
			it('should generate 2 summary lists with 2 rows each', () => {
				const testMappedSections = [
					{
						header: 'Section 1',
						rows: [
							{
								title: 'Row 1',
								value: 'Yes',
								valueType: 'text',
								actionText: 'Change',
								actionLink: '#'
							},
							{
								title: 'Row 2',
								value: ['Option One', 'Option two'],
								valueType: 'text',
								actionText: 'Change',
								actionLink: '#'
							}
						]
					},
					{
						header: 'Section 2',
						rows: [
							{
								title: 'Row 3',
								value: ['http://testURLOne.com/file.txt', 'http://testURLTwo.com/filetwo.pdf'],
								valueType: 'link',
								actionText: 'Details',
								actionLink: '#'
							},
							{
								title: 'Row 4',
								value: 'http://testURLOne.com/file.txt',
								valueType: 'link',
								actionText: 'Details',
								actionLink: '#'
							}
						]
					}
				];
				const expectedReturn = [
					{
						card: {
							title: {
								text: 'Section 1'
							}
						},
						rows: [
							{
								key: {
									text: 'Row 1'
								},
								value: {
									html: '<span>Yes</span>'
								},
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'Row 1'
										}
									]
								}
							},
							{
								key: {
									text: 'Row 2'
								},
								value: {
									html: '<span>Option One</span><br><span>Option two</span><br>'
								},
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'Row 2'
										}
									]
								}
							}
						]
					},
					{
						card: {
							title: {
								text: 'Section 2'
							}
						},
						rows: [
							{
								key: {
									text: 'Row 3'
								},
								value: {
									html: '<a href="http://testURLOne.com/file.txt" class="govuk-link">http://testURLOne.com/file.txt</a><br><a href="http://testURLTwo.com/filetwo.pdf" class="govuk-link">http://testURLTwo.com/filetwo.pdf</a><br>'
								},
								actions: {
									items: [
										{
											href: '#',
											text: 'Details',
											visuallyHiddenText: 'Row 3'
										}
									]
								}
							},
							{
								key: {
									text: 'Row 4'
								},
								value: {
									html: '<a href="http://testURLOne.com/file.txt" class="govuk-link">http://testURLOne.com/file.txt</a>'
								},
								actions: {
									items: [
										{
											href: '#',
											text: 'Details',
											visuallyHiddenText: 'Row 4'
										}
									]
								}
							}
						]
					}
				];
				const formattedSections = [];
				for (const section of testMappedSections) {
					// @ts-ignore
					formattedSections.push(generateSummaryList(section.header, section.rows));
				}
				expect(formattedSections).toEqual(expectedReturn);
			});
		});
	});

	describe('async-route helper', () => {
		it('should throw error if route throws error', async () => {
			const error = new Error('some error');

			const route = async () => {
				throw error;
			};

			await expect(asyncRoute(route)).rejects.toThrow(error);
		});

		it('should throw error if route returns rejected promise', async () => {
			const error = new Error('some error');

			const route = async () => {
				await Promise.reject(error);
			};

			await expect(asyncRoute(route)).rejects.toThrow(error);
		});
	});

	describe('BodyToPayload', () => {
		it('should format correct the body', () => {
			const body = {
				'A1.B1.C1': 'a1b1c1',
				'A1.B2.C2': 'a1b2c2',
				'A1.B1.C3': 'a1b1c3',
				'A1.C3': 'a1c3',
				'A2.B2': 'a2b2',
				'A2.B1': 'a2b1',
				A3: 'a3'
			};

			const payload = bodyToPayload(body);
			const expectPayload = {
				A1: {
					B1: {
						C1: 'a1b1c1',
						C3: 'a1b1c3'
					},
					B2: {
						C2: 'a1b2c2'
					},
					C3: 'a1c3'
				},
				A2: {
					B2: 'a2b2',
					B1: 'a2b1'
				},
				A3: 'a3'
			};

			expect(payload).toMatchObject(expectPayload);
		});
	});

	describe('dates', () => {
		describe('dateIsValid', () => {
			it('should return true if day, month and year params form a date that is semantically valid and real', () => {
				expect(dateIsValid(2024, 2, 29)).toBe(true);
			});
			it('should return false if day, month and year params form a date that is semantically valid but not real', () => {
				expect(dateIsValid(2023, 2, 29)).toBe(false);
			});
			it('should return true if day, month and year params form a valid real date', () => {
				expect(dateIsValid(2023, 2, 1)).toBe(true);
			});
			it('should return false if day parameter is outside the valid range', () => {
				expect(dateIsValid(2023, 1, 0)).toBe(false);
				expect(dateIsValid(2023, 1, 32)).toBe(false);
			});
			it('should return false if month parameter is outside the valid range', () => {
				expect(dateIsValid(2023, 0, 1)).toBe(false);
				expect(dateIsValid(2023, 13, 1)).toBe(false);
			});
		});

		describe('isDateInstance', () => {
			it('should determine if a date is an instance of Date', () => {
				const year = 1989;
				const month = 3;
				const day = 25;
				const date = new Date(year, month - 1, day);

				const instanceOfDate = isDateInstance(date);

				expect(typeof instanceOfDate).toEqual('boolean');
			});
		});

		describe('datestamp', () => {
			it('should return BST date if date between March-October', () => {
				// 05/02/2023 @ 8:54am
				const unixTimestamp = '1683017640';
				const options = { format: 'yyyy-MM-dd HH:mm:ss zzz' };

				const gmtDate = datestamp(unixTimestamp, options);

				expect(gmtDate).toEqual('2023-05-02 09:54:00 BST');
			});

			it('should return GMT date if date between November-February', () => {
				// 12/02/2023 @ 8:54am
				const unixTimestamp = '1701507240';
				const options = { format: 'yyyy-MM-dd HH:mm:ss zzz' };

				const gmtDate = datestamp(unixTimestamp, options);

				expect(gmtDate).toEqual('2023-12-02 08:54:00 GMT');
			});
		});

		describe('displayDate', () => {
			it('should return BST date if between last Sunday in March and last Sunday of October', () => {
				const date = '2023-03-26T23:00:00+00:00';

				const gmtDate = displayDate(date);

				expect(gmtDate).toEqual('27 March 2023');
			});

			it('should return GMT date if not if between last Sunday in March and last Sunday of October', () => {
				const date = '2023-10-29T23:00:00+00:00';

				const gmtDate = displayDate(date);

				expect(gmtDate).toEqual('29 October 2023');
			});
		});
	});

	describe('nameToString', () => {
		it('should converts a multi part person name to a single string', () => {
			const applicant = {
				firstName: 'firstName',
				lastName: 'lastName',
				id: 1,
				organisationName: 'organisationName',
				email: 'email',
				website: 'website',
				phoneNumber: 'phoneNumber'
			};

			const formattedApplicant = nameToString(applicant);

			expect(typeof formattedApplicant).toEqual('string');
		});
	});
});
