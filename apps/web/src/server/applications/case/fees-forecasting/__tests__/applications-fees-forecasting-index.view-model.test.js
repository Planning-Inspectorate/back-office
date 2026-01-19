import { jest } from '@jest/globals';
import {
	getStatusTag,
	getLinkHTML,
	getSupplementaryComponentItem,
	getDisplayValue,
	getFeesForecastingIndexViewModel
} from '../applications-fees-forecasting-index.view-model.js';
import { fixtureFeesForecastingIndex } from '../../../../../../testing/applications/fixtures/fees-forecasting.js';

const mockDisplayValues = {
	submitted_by_applicant: 'Submitted',
	awaiting_submission: 'Awaiting submission',
	not_applicable: 'Not applicable'
};

describe('applications fees forecasting index view-model', () => {
	describe('#getStatusTag', () => {
		beforeAll(() => {
			const mockDate = new Date('2025-11-20T00:00:00.000Z');
			jest.useFakeTimers({ advanceTimers: true }).setSystemTime(mockDate);
		});

		afterAll(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		it('should return the Refunded tag HTML if there is a refund issue date', () => {
			const invoice = {
				paymentDueDate: '2025-10-10T00:00:00.000Z',
				paymentDate: '2025-10-05T00:00:00.000Z',
				refundIssueDate: '2025-10-15T00:00:00.000Z'
			};
			const result = getStatusTag(invoice);

			expect(result).toEqual('<strong class="govuk-tag govuk-tag--purple">Refunded</strong>');
		});

		it('should return the Paid tag HTML if there is a payment date', () => {
			const invoice = {
				paymentDueDate: '2025-11-10T00:00:00.000Z',
				paymentDate: '2025-11-05T00:00:00.000Z',
				refundIssueDate: null
			};
			const result = getStatusTag(invoice);

			expect(result).toEqual('<strong class="govuk-tag govuk-tag--green">Paid</strong>');
		});

		it('should return the Due tag HTML if there is a payment due date and it is today', () => {
			const invoice = {
				paymentDueDate: '2025-11-20T00:00:00.000Z',
				paymentDate: null,
				refundIssueDate: null
			};
			const result = getStatusTag(invoice);

			expect(result).toEqual('<strong class="govuk-tag govuk-tag--orange">Due</strong>');
		});

		it('should return the Due tag HTML if there is a payment due date and it is in the past', () => {
			const invoice = {
				paymentDueDate: '2025-11-15T00:00:00.000Z',
				paymentDate: null,
				refundIssueDate: null
			};
			const result = getStatusTag(invoice);

			expect(result).toEqual('<strong class="govuk-tag govuk-tag--orange">Due</strong>');
		});

		it('should return the Issued tag HTML if there is a payment due date and it is in the future', () => {
			const invoice = {
				paymentDueDate: '2025-12-30T00:00:00.000Z',
				paymentDate: null,
				refundIssueDate: null
			};
			const result = getStatusTag(invoice);

			expect(result).toEqual('<strong class="govuk-tag govuk-tag--yellow">Issued</strong>');
		});

		it('should return an empty string if no refund issue date, payment date or payment due date', () => {
			const invoice = {
				paymentDueDate: null,
				paymentDate: null,
				refundIssueDate: null
			};
			const result = getStatusTag(invoice);

			expect(result).toEqual('');
		});
	});

	describe('#getLinkHTML', () => {
		it('should return the correct HTML string when href and link text are passed in', () => {
			const mockLinkText = 'mock-link-text';
			const mockHref = 'mock-href';
			const result = getLinkHTML(mockLinkText, mockHref);

			expect(result).toEqual('<a href="mock-href" class="govuk-link">mock-link-text</a>');
		});

		it('should return an empty string if link text has a falsy value', () => {
			const mockLinkText = null;
			const mockHref = 'mock-href';
			const result = getLinkHTML(mockLinkText, mockHref);

			expect(result).toEqual('');
		});
	});

	describe('#getDisplayValue', () => {
		it('should return the corresponding display value when an enum value is passed in', () => {
			const mockEnumValue = 'submitted_by_applicant';
			const result = getDisplayValue(mockDisplayValues, mockEnumValue);

			expect(result).toEqual('Submitted');
		});

		it('should return an empty string if a falsy value is passed in', () => {
			const mockEnumValue = null;
			const result = getDisplayValue(mockDisplayValues, mockEnumValue);

			expect(result).toEqual('');
		});
	});

	describe('#getSupplementaryComponentItem', () => {
		it('should return the submission status and submission date if submitted', () => {
			const mockSubmissionStatus = 'submitted_by_applicant';
			const mockSubmissionDate = 1710000000;

			const result = getSupplementaryComponentItem(
				mockDisplayValues,
				mockSubmissionStatus,
				mockSubmissionDate
			);

			expect(result).toEqual('Submitted, 09 Mar 2024');
		});

		it('should return the submission status if not submitted', () => {
			const mockSubmissionStatus = 'awaiting_submission';
			const mockSubmissionDate = null;

			const result = getSupplementaryComponentItem(
				mockDisplayValues,
				mockSubmissionStatus,
				mockSubmissionDate
			);

			expect(result).toEqual('Awaiting submission');
		});

		it('should return an empty string if the submission status has a falsy value', () => {
			const mockSubmissionStatus = null;
			const mockSubmissionDate = null;

			const result = getSupplementaryComponentItem(
				mockDisplayValues,
				mockSubmissionStatus,
				mockSubmissionDate
			);

			expect(result).toEqual('');
		});
	});

	describe('#getFeesForecastingIndexViewModel', () => {
		it('should return fees and forecasting data mapped to the index view model', () => {
			const result = getFeesForecastingIndexViewModel(fixtureFeesForecastingIndex);

			expect(result).toEqual({
				selectedPageType: 'fees-forecasting',
				internalUseSection: [
					{
						key: { text: 'New maturity' },
						value: { text: 'C' },
						actions: {
							items: [
								{
									href: '#',
									text: 'Change',
									visuallyHiddenText: 'new maturity'
								}
							]
						}
					},
					{
						key: { text: 'Examining inspectors' },
						value: { html: '2 band 2 inspectors<br/>1 band 3 inspectors' },
						actions: {
							items: [
								{
									href: '#',
									text: 'Change',
									visuallyHiddenText: 'examining inspectors'
								}
							]
						}
					},
					{
						key: { text: 'MEM last updated' },
						value: { text: '09 Mar 2024' },
						actions: {
							items: [
								{
									href: '/applications-service/case/4/fees-forecasting/maturity-evaluation-matrix',
									text: 'Change',
									visuallyHiddenText: 'MEM last updated'
								}
							]
						}
					},
					{
						key: { text: 'Additional comments (optional)' },
						value: {
							html: `Some comments`
						},
						actions: {
							items: [
								{
									href: '#',
									text: 'Change',
									visuallyHiddenText: 'additional comments'
								}
							]
						}
					}
				],
				accordionSections: [
					{
						heading: 'Pre-application overview',
						content: [
							{
								key: { text: 'Tier' },
								value: { text: 'Basic' },
								actions: {
									items: [{ href: '#', text: 'Change', visuallyHiddenText: 'tier' }]
								}
							},
							{
								key: { text: 'Link to s61 summary' },
								value: { html: '<a href="#" class="govuk-link">mock-s61-summary-uri</a>' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'link to s61 summary'
										}
									]
								}
							},
							{
								key: { text: 'Estimated scoping submission date' },
								value: { text: '09 Feb 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'estimated scoping submission date'
										}
									]
								}
							},
							{
								key: { text: 'Adequacy of Consultation Milestone (AoCM) date' },
								value: { text: '13 Mar 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'adequacy of consultation milestone date'
										}
									]
								}
							},
							{
								key: { text: 'Evidence plan process' },
								value: { text: 'Required' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'evidence plan process'
										}
									]
								}
							},
							{
								key: { text: 'Anticipated submission date internal' },
								value: { text: '05 Jan 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'anticipated submission date internal'
										}
									]
								}
							}
						],
						component: 'summary-list'
					},
					{
						heading: 'Fees',
						content: {
							firstCellIsHeader: false,
							rows: [
								[
									{ text: 'Pre-acceptance' },
									{ text: '£20500' },
									{ text: '180000000' },
									{
										html: '<strong class="govuk-tag govuk-tag--purple">Refunded</strong>'
									},
									{ html: '<a href="#" class="govuk-link">Review</a>' }
								],
								[
									{ text: 'Acceptance' },
									{ text: '£30000' },
									{ text: '180000001' },
									{
										html: '<strong class="govuk-tag govuk-tag--purple">Refunded</strong>'
									},
									{ html: '<a href="#" class="govuk-link">Review</a>' }
								]
							],
							head: [
								{ text: 'Stage' },
								{ text: 'Amount' },
								{ text: 'Invoice number' },
								{ text: 'Status' },
								{ text: 'Action' }
							]
						},
						component: 'table',
						buttonText: 'Add new fee',
						buttonLink: '#'
					},
					{
						heading: 'Pre-application project meetings',
						content: {
							firstCellIsHeader: false,
							rows: [
								[
									{ text: 'Inception meeting' },
									{ text: '09 Jan 2025' },
									{ html: '<a href="#" class="govuk-link">Change</a>' }
								],
								[
									{ text: 'Project Update Meeting (PUM)' },
									{ text: '11 Jan 2025' },
									{ html: '<a href="#" class="govuk-link">Change</a>' }
								]
							],
							head: [{ text: 'Meeting agenda' }, { text: 'Date' }, { text: 'Action' }]
						},
						component: 'table',
						buttonText: 'Add project meeting',
						buttonLink: '#'
					},
					{
						heading: 'Pre-application evidence plan meetings',
						content: {
							firstCellIsHeader: false,
							rows: [
								[
									{ text: 'Flood Risk Assessment' },
									{ text: '09 Jan 2025' },
									{ html: '<a href="#" class="govuk-link">Change</a>' }
								],
								[
									{ text: 'Habitat Regulation Assessment' },
									{ text: '11 Jan 2025' },
									{ html: '<a href="#" class="govuk-link">Change</a>' }
								]
							],
							head: [{ text: 'Issues discussed' }, { text: 'Date' }, { text: 'Action' }]
						},
						component: 'table',
						buttonText: 'Add evidence plan meeting',
						buttonLink: '#'
					},
					{
						heading: 'Pre-application supplementary components',
						content: [
							{
								key: { text: 'Link to issues tracker' },
								value: {
									html: '<a href="#" class="govuk-link">mock-issues-tracker-uri</a>'
								},
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'link to issues tracker'
										}
									]
								}
							},
							{
								key: { text: 'Essential fast track components' },
								value: { text: 'Yes' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'essential fast track components'
										}
									]
								}
							},
							{
								key: {
									text: 'Principal area disagreement summary statement (PADSS)'
								},
								value: { text: 'Submitted, 09 Mar 2024' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'principal area disagreement summary statement (PADSS)'
										}
									]
								}
							},
							{
								key: { text: 'Policy compliance document (PCD)' },
								value: { text: 'Not applicable' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'policy compliance document (PCD)'
										}
									]
								}
							},
							{
								key: { text: 'Design approach document (DAD)' },
								value: { text: 'Awaiting submission' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'design approach document (DAD)'
										}
									]
								}
							},
							{
								key: { text: 'Mature outline control documents' },
								value: { text: 'Awaiting submission' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'mature outline control documents'
										}
									]
								}
							},
							{
								key: { text: 'CA and TP evidence' },
								value: { text: 'Awaiting submission' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'CA and TP evidence'
										}
									]
								}
							},
							{
								key: { text: 'Public sector equality duty (PSED)' },
								value: { text: 'Not applicable' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'public sector equality duty (PSED)'
										}
									]
								}
							},
							{
								key: { text: 'Fast track admission document' },
								value: { text: 'Submitted, 07 Jun 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'fast track admission document'
										}
									]
								}
							},
							{
								key: {
									text: 'Multiparty application readiness gate-check (trial)'
								},
								value: { text: 'Awaiting submission' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'multiparty application readiness gate-check (trial)'
										}
									]
								}
							}
						],
						component: 'summary-list'
					},
					{
						heading: 'Pre-application programme document',
						content: [
							{
								key: { text: 'Link to programme document' },
								value: { html: '<a href="#" class="govuk-link">mock-programme-document-uri</a>' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'link to programme document'
										}
									]
								}
							},
							{
								key: { text: 'Date updated programme document is received' },
								value: { text: '10 Apr 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'date updated programme document is received'
										}
									]
								}
							},
							{
								key: { text: 'Date programme document reviewed by EST' },
								value: { text: '11 May 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'date programme document reviewed by EST'
										}
									]
								}
							},
							{
								key: {
									text: 'Date case team issued comments on programme document'
								},
								value: { text: '07 Jun 2025' },
								actions: {
									items: [
										{
											href: '#',
											text: 'Change',
											visuallyHiddenText: 'date case team issued comments on programme document'
										}
									]
								}
							}
						],
						component: 'summary-list'
					}
				]
			});
		});
	});
});
