import { jest } from '@jest/globals';
import {
	getSectionData,
	getRows,
	getBackLinkParams
} from '../applications-fees-forecasting.utils.js';
import { fixtureFeesForecastingEdit } from '../../../../../../testing/applications/fixtures/fees-forecasting.js';

describe('applications fees forecasting utils', () => {
	describe('#getSectionData', () => {
		it('should return the correct section when section name, section names and section data are passed in', () => {
			const sectionName = 'test-section';
			const sectionNames = fixtureFeesForecastingEdit.urlSectionNames;
			const sectionData = fixtureFeesForecastingEdit.sectionData;

			const result = getSectionData(sectionName, sectionNames, sectionData);

			expect(result).toEqual({
				sectionTitle: 'Test section',
				pageHeading: 'Test page heading',
				fieldName: 'testSection',
				hintText: 'Test section hint text',
				componentType: 'date-input'
			});
		});

		it('should return an empty object if the section name does not match any value in the section names object', () => {
			const sectionName = 'new-section-name';
			const sectionNames = fixtureFeesForecastingEdit.urlSectionNames;
			const sectionData = fixtureFeesForecastingEdit.sectionData;

			const result = getSectionData(sectionName, sectionNames, sectionData);

			expect(result).toEqual({});
		});

		it('should return an empty object if no section name is passed in', () => {
			const sectionName = '';
			const sectionNames = fixtureFeesForecastingEdit.urlSectionNames;
			const sectionData = fixtureFeesForecastingEdit.sectionData;

			const result = getSectionData(sectionName, sectionNames, sectionData);

			expect(result).toEqual({});
		});

		it('should return an empty object if no section names are passed in', () => {
			const sectionName = 'Test section';
			const sectionNames = {};
			const sectionData = fixtureFeesForecastingEdit.sectionData;

			const result = getSectionData(sectionName, sectionNames, sectionData);

			expect(result).toEqual({});
		});

		it('should return an empty object if no section data is passed in', () => {
			const sectionName = 'Test section';
			const sectionNames = fixtureFeesForecastingEdit.urlSectionNames;
			const sectionData = {};

			const result = getSectionData(sectionName, sectionNames, sectionData);

			expect(result).toEqual({});
		});
	});

	describe('#getRows', () => {
		const helpers = {
			getDisplayValue: jest.fn().mockReturnValue('Examination'),
			getStatusTag: jest.fn().mockReturnValue('<strong class="govuk-tag">Paid</strong>'),
			formatDateForDisplay: jest.fn().mockReturnValue('01 Jan 2025'),
			invoiceStageDisplayValues: { examination: 'Examination' }
		};

		it('should return the correct rows for invoices when invoice number is present', () => {
			const tableData = {
				invoiceNumber: '123',
				invoiceStage: 'examination',
				amountDue: '500.00'
			};

			const result = getRows(tableData, helpers);

			expect(result).toEqual([
				[
					{ text: 'Examination' },
					{ text: '£500.00' },
					{ text: '123' },
					{ html: '<strong class="govuk-tag">Paid</strong>' }
				]
			]);
		});

		it('should return the correct rows for meetings when meeting agenda is present', () => {
			const tableData = {
				agenda: 'Test Meeting',
				meetingDate: '2025-01-01T00:00:00.000Z'
			};

			const result = getRows(tableData, helpers);

			expect(result).toEqual([[{ text: 'Test Meeting' }, { text: '01 Jan 2025' }]]);
		});

		it('should return an empty array if invoice number and meeting agenda are NOT present', () => {
			const tableData = {};

			const result = getRows(tableData, helpers);

			expect(result).toEqual([]);
		});
	});

	describe('#getBackLinkParams', () => {
		it('should return the correct params for invoices when invoice number is present', () => {
			const tableData = {
				id: '1',
				caseId: '10',
				invoiceNumber: '123'
			};

			const result = getBackLinkParams(tableData);

			expect(result).toEqual({ caseId: '10', feeId: '1' });
		});

		it('should return the correct params for meetings when meeting agenda is present', () => {
			const tableData = {
				id: '2',
				caseId: '20',
				agenda: 'Test Meeting'
			};

			const result = getBackLinkParams(tableData);

			expect(result).toEqual({ caseId: '20', meetingId: '2' });
		});

		it('should return an empty object if invoice number and meeting agenda are NOT present', () => {
			const tableData = {};

			const result = getBackLinkParams(tableData);

			expect(result).toEqual({});
		});
	});
});
