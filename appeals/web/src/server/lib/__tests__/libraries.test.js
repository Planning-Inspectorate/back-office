import { addressToString } from '../address-formatter.js';
import asyncRoute from '../async-route.js';
import { bodyToPayload } from '../body-formatter.js';
import {
	dateIsInTheFuture,
	dateIsValid,
	isDateInstance,
	dayMonthYearToApiDateString,
	webDateToDisplayDate
} from '../dates.js';
import { appealShortReference } from '../nunjucks-filters/appeals.js';
import { datestamp, displayDate } from '../nunjucks-filters/date.js';
import { generateSummaryList } from '../nunjucks-template-builders/summary-list-builder.js';
import { nameToString } from '../person-name-formatter.js';
import { objectContainsAllKeys } from '../object-utilities.js';
import { getIdByNameFromIdNamePairs } from '../id-name-pairs.js';
import {
	convertFromBooleanToYesNo,
	convertFromBooleanToYesNoWithOptionalDetails
} from '#lib/boolean-formatter.js';
import { addConditionalHtml } from '#lib/nunjucks-filters/add-conditional-html.js';
import {
	mapReasonOptionsToCheckboxItemParameters,
	mapReasonsToReasonsList,
	getNotValidReasonsTextFromRequestBody
} from '../mappers/validation-outcome-reasons.mapper.js';
import { appellantCaseInvalidReasons } from '#testing/app/fixtures/referencedata.js';

describe('Libraries', () => {
	describe('addressFormatter', () => {
		it('should converts a multi part address to a single string', () => {
			const address = {
				postCode: 'postcode',
				addressLine1: 'address 1',
				addressLine2: 'address 2',
				town: 'town',
				county: 'county'
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
						/** @type {import('../nunjucks-template-builders/summary-list-builder.js').Row[]} */
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
						/** @type {import('../nunjucks-template-builders/summary-list-builder.js').Row[]} */
						rows: [
							{
								title: 'Row 3',
								value: [
									{ href: 'link', title: 'link', target: '_new' },
									{ href: 'link', title: 'link', target: '_self' }
								],
								valueType: 'link',
								actionText: 'Details',
								actionLink: '#'
							},
							{
								title: 'Row 4',
								value: { href: 'link', title: 'link', target: '_new' },
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
									html: '<span>Option One</span><br><span>Option two</span>'
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
									html: '<a href="link" target="_new" class="govuk-link">link</a><br><a href="link" target="_self" class="govuk-link">link</a>'
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
									html: '<a href="link" target="_new" class="govuk-link">link</a>'
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
					formattedSections.push(generateSummaryList(section));
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

		describe('dateIsInTheFuture', () => {
			it('should return true if day, month and year params form a date that is in the future', () => {
				expect(dateIsInTheFuture(3000, 1, 1)).toBe(true);
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

		describe('dayMonthYearToApiDateString', () => {
			it('should return the correct date as a string in the format YYYY-MM-DD when provided a DayMonthYear with single-digit day and month values', () => {
				const convertedDate = dayMonthYearToApiDateString({
					day: 1,
					month: 2,
					year: 2023
				});

				expect(convertedDate).toBe('2023-02-01');
			});

			it('should return the correct date as a string in the format YYYY-MM-DD when provided a DayMonthYear with double-digit day and month values', () => {
				const convertedDate = dayMonthYearToApiDateString({
					day: 10,
					month: 10,
					year: 2023
				});

				expect(convertedDate).toBe('2023-10-10');
			});
		});

		describe('webDateToDisplayDate', () => {
			it('should return the correct date as a string in the format of "1 January 2024" when provided a DayMonthYear with single-digit day and month values', () => {
				const convertedDate = webDateToDisplayDate({
					day: 1,
					month: 1,
					year: 2024
				});

				expect(convertedDate).toBe('1 January 2024');
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

	describe('objectContainsAllKeys', () => {
		it('should return true if the provided object contains all of the provided keys, false otherwise', () => {
			const testObject = {
				firstKey: 'firstKey value',
				'second-key': 'second-key value',
				3: '3 value',
				fourthKey: ['fourthKey', 'value']
			};

			expect(objectContainsAllKeys(testObject, 'firstKey')).toBe(true);
			expect(objectContainsAllKeys(testObject, 'second-key')).toBe(true);
			expect(objectContainsAllKeys(testObject, '3')).toBe(true);
			expect(objectContainsAllKeys(testObject, 'fourthKey')).toBe(true);
			expect(objectContainsAllKeys(testObject, 'keyThatDoesNotExist')).toBe(false);
			expect(objectContainsAllKeys(testObject, ['firstKey', 'second-key', '3', 'fourthKey'])).toBe(
				true
			);
			expect(
				objectContainsAllKeys(testObject, [
					'firstKey',
					'second-key',
					'3',
					'fourthKey',
					'keyThatDoesNotExist'
				])
			).toBe(false);
		});
	});

	describe('addConditionalHtml', () => {
		it('should add the provided html to the "conditional" property of the supplied object', () => {
			const item = {};
			const conditionalHtml = '<div>test</div>';
			/** @type {Object<string, any>} */
			const result = addConditionalHtml(item, conditionalHtml);

			expect(result.conditional).toEqual({ html: '<div>test</div>' });
		});
	});

	describe('getIdByNameFromIdNamePairs', () => {
		it('should return the id of the IdNamePair with the provided name, if a matching IdNamePair is present in the provided array', () => {
			const matchingId = getIdByNameFromIdNamePairs(
				[
					{ id: 0, name: 'a' },
					{ id: 1, name: 'b' },
					{ id: 2, name: 'c' }
				],
				'b'
			);

			expect(matchingId).toBe(1);
		});
		it('should return undefined, if an IdNamePair with the provided name is not present in the provided array', () => {
			const matchingId = getIdByNameFromIdNamePairs(
				[
					{ id: 0, name: 'a' },
					{ id: 1, name: 'b' },
					{ id: 2, name: 'c' }
				],
				'd'
			);

			expect(matchingId).toBe(undefined);
		});
	});

	describe('convertFromBooleanToYesNo', () => {
		it('should return null if provided boolean is undefined', () => {
			expect(convertFromBooleanToYesNo(undefined)).toBe(null);
		});
		it('should return null if provided boolean is null', () => {
			expect(convertFromBooleanToYesNo(null)).toBe(null);
		});
		it('should return "Yes" if provided boolean is true', () => {
			expect(convertFromBooleanToYesNo(true)).toBe('Yes');
		});
		it('should return "No" if provided boolean is false', () => {
			expect(convertFromBooleanToYesNo(false)).toBe('No');
		});
	});

	describe('convertFromBooleanToYesNoWithOptionalDetails', () => {
		const testOptionalDetails = 'test optional details';
		it('should return "Yes", if provided boolean is true and optionalDetailsIfYes is not provided', () => {
			expect(convertFromBooleanToYesNoWithOptionalDetails(true)).toBe('Yes');
		});
		it('should return an array with "Yes" as the first item and optional details as the second item, if provided boolean is true and optionalDetailsIfYes is provided', () => {
			expect(convertFromBooleanToYesNoWithOptionalDetails(true, testOptionalDetails)).toEqual([
				'Yes',
				testOptionalDetails
			]);
		});
		it('should return "No" if provided boolean is false', () => {
			expect(convertFromBooleanToYesNoWithOptionalDetails(false)).toBe('No');
		});
		it('should return an empty string if provided boolean is null', () => {
			expect(convertFromBooleanToYesNoWithOptionalDetails(null)).toBe('');
		});
		it('should return an empty string if provided boolean is undefined', () => {
			expect(convertFromBooleanToYesNoWithOptionalDetails(undefined)).toBe('');
		});
	});

	describe('mappers/validation-outcome-reasons.mapper', () => {
		describe('mapReasonOptionsToCheckboxItemParameters', () => {
			it('should return an array of checkbox item parameters with the expected properties if checkedOptions is undefined', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					undefined,
					[],
					{},
					'invalidReason',
					undefined
				);

				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: false,
						addAnother: { textItems: [''] }
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: false
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if checkedOptions is an empty array', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					[],
					[],
					{},
					'invalidReason',
					undefined
				);

				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: false,
						addAnother: { textItems: [''] }
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: false
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are no reasonOptions with text', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons.filter((reasonOption) => reasonOption.hasText === false),
					[],
					[],
					{},
					'invalidReason',
					undefined
				);
				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: false
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are checkedOptions but no reasonOptions with text', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons.filter((reasonOption) => reasonOption.hasText === false),
					[23],
					[],
					{},
					'invalidReason',
					undefined
				);
				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: true
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are checkedOptions and reasonOptions with text and existingReasons, but not a bodyValidationOutcome or sessionValidationOutcome', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					[22, 23],
					[
						{
							name: {
								id: 22,
								name: 'Documents have not been submitted on time',
								hasText: true
							},
							text: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						},
						{
							name: {
								id: 23,
								name: "The appellant doesn't have the right to appeal",
								hasText: false
							}
						}
					],
					{},
					'invalidReason',
					undefined
				);
				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: true,
						addAnother: {
							textItems: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						}
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: true
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are checkedOptions and reasonOptions with text and a sessionValidationOutcome, but not existingReasons or a bodyValidationOutcome', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					[22, 23],
					[],
					{},
					'invalidReason',
					{
						appealId: '1',
						validationOutcome: 'invalid',
						reasons: ['22', '23'],
						reasonsText: {
							22: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						}
					}
				);
				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: true,
						addAnother: {
							textItems: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						}
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: true
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are checkedOptions and reasonOptions with text and a bodyValidationOutcome, but not existingReasons or a sessionValidationOutcome', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					[22, 23],
					[],
					{
						invalidReason: ['22', '23'],
						'invalidReason-22': [
							'test document 1 has not been submitted on time',
							'test document 2 has not been submitted on time'
						]
					},
					'invalidReason',
					undefined
				);
				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: true,
						addAnother: {
							textItems: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						}
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: true
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are checkedOptions and reasonOptions with text and existingReasons and a sessionValidationOutcome, but not a bodyValidationOutcome (sessionValidationOutcome text items should take precedence over any conflicting existingReasons text items)', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					[22, 23],
					[
						{
							name: {
								id: 22,
								name: 'Documents have not been submitted on time',
								hasText: true
							},
							text: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						},
						{
							name: {
								id: 23,
								name: "The appellant doesn't have the right to appeal",
								hasText: false
							}
						}
					],
					{},
					'invalidReason',
					{
						appealId: '1',
						validationOutcome: 'invalid',
						reasons: ['22', '23'],
						reasonsText: {
							22: ['session text item 1']
						}
					}
				);
				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: true,
						addAnother: {
							textItems: ['session text item 1']
						}
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: true
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});

			it('should return an array of checkbox item parameters with the expected properties if there are checkedOptions and reasonOptions with text and existingReasons and a sessionValidationOutcome and a bodyValidationOutcome (bodyValidationOutcome text items should take precedence over any conflicting sessionValidationOutcome or existingReasons text items)', () => {
				const result = mapReasonOptionsToCheckboxItemParameters(
					appellantCaseInvalidReasons,
					[22, 23],
					[
						{
							name: {
								id: 22,
								name: 'Documents have not been submitted on time',
								hasText: true
							},
							text: [
								'test document 1 has not been submitted on time',
								'test document 2 has not been submitted on time'
							]
						},
						{
							name: {
								id: 23,
								name: "The appellant doesn't have the right to appeal",
								hasText: false
							}
						}
					],
					{
						invalidReason: ['22', '23'],
						'invalidReason-22': 'body text item 1'
					},
					'invalidReason',
					{
						appealId: '1',
						validationOutcome: 'invalid',
						reasons: ['22', '23'],
						reasonsText: {
							22: ['session text item 1']
						}
					}
				);

				const expectedResult = [
					{
						value: '21',
						text: 'Appeal has not been submitted on time',
						checked: false
					},
					{
						value: '22',
						text: 'Documents have not been submitted on time',
						checked: true,
						addAnother: {
							textItems: ['body text item 1']
						}
					},
					{
						value: '23',
						text: "The appellant doesn't have the right to appeal",
						checked: true
					},
					{
						value: '24',
						text: 'Other',
						checked: false,
						addAnother: { textItems: [''] }
					}
				];

				expect(result).toEqual(expectedResult);
			});
		});

		describe('mapReasonsToReasonsList', () => {
			it('should return an empty array if reasons is undefined', () => {
				const result = mapReasonsToReasonsList(appellantCaseInvalidReasons, undefined, undefined);

				expect(result).toEqual([]);
			});

			it('should return an empty array if reasons is an empty array', () => {
				const result = mapReasonsToReasonsList(appellantCaseInvalidReasons, [], undefined);

				expect(result).toEqual([]);
			});

			it('should return an array of strings or string arrays with the expected properties if reasonsText is undefined', () => {
				const result = mapReasonsToReasonsList(
					appellantCaseInvalidReasons,
					['22', '23'],
					undefined
				);

				expect(result).toEqual([
					'Documents have not been submitted on time',
					"The appellant doesn't have the right to appeal"
				]);
			});

			it('should return an array of strings or string arrays with the expected properties if reasonsText is an empty object', () => {
				const result = mapReasonsToReasonsList(appellantCaseInvalidReasons, ['22', '23'], {});

				expect(result).toEqual([
					'Documents have not been submitted on time',
					"The appellant doesn't have the right to appeal"
				]);
			});

			it('should return an array of strings or string arrays with the expected properties if reasons and reasonsText are defined and populated with values', () => {
				const result = mapReasonsToReasonsList(appellantCaseInvalidReasons, ['22', '23'], {
					22: ['test reason text 1', 'test reason text 2']
				});

				expect(result).toEqual([
					'Documents have not been submitted on time:',
					['test reason text 1', 'test reason text 2'],
					"The appellant doesn't have the right to appeal"
				]);
			});
		});

		describe('getNotValidReasonsTextFromRequestBody', () => {
			it('should throw an error if reasonKey is not present in requestBody', () => {
				expect(() => {
					getNotValidReasonsTextFromRequestBody(
						{
							incompleteReason: ['22', '23']
						},
						'invalidReason'
					);
				}).toThrow('reasonKey "invalidReason" not found in requestBody');
			});

			it('should return an object with the expected properties if reasonKey is present in requestBody, but the expected reasonText keys are missing from requestBody', () => {
				const result = getNotValidReasonsTextFromRequestBody(
					{
						invalidReason: ['22', '23']
					},
					'invalidReason'
				);

				expect(result).toEqual({});
			});

			it('should return an object with the expected properties if reasonKey and the expected reasonText keys are present in requestBody', () => {
				const result = getNotValidReasonsTextFromRequestBody(
					{
						invalidReason: ['22', '23'],
						'invalidReason-22': ['test reason text 1', 'test reason text 2']
					},
					'invalidReason'
				);

				expect(result).toEqual({
					22: ['test reason text 1', 'test reason text 2']
				});
			});
		});
	});
});
