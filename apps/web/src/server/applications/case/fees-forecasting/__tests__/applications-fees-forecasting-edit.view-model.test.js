//@ts-nocheck
import { jest } from '@jest/globals';

describe('applications fees forecasting edit view model', () => {
	describe('#getFeesForecastingEditViewModel', () => {
		const sectionName = 'test-section';

		jest.unstable_mockModule(
			'./src/server/applications/case/fees-forecasting/applications-fees-forecasting.utils.js',
			() => {
				const mockGetSectionData = jest.fn();
				const mockGetRows = jest.fn();
				const mockGetBackLinkParams = jest.fn();

				return {
					__esModule: true,
					getSectionData: mockGetSectionData,
					getRows: mockGetRows,
					getBackLinkParams: mockGetBackLinkParams
				};
			}
		);

		it('should return the section data mapped to the edit page view model', async () => {
			const { getSectionData } = await import('../applications-fees-forecasting.utils.js');

			getSectionData.mockReturnValue({
				sectionTitle: 'Test section',
				pageHeading: 'Test page heading',
				fieldName: 'testSection',
				hintText: 'Test section hint text',
				componentType: 'date-input'
			});

			const projectName = 'Test case';

			const { getFeesForecastingEditViewModel } = await import(
				'../applications-fees-forecasting-edit.view-model.js'
			);

			const result = getFeesForecastingEditViewModel(projectName, sectionName);

			expect(result).toEqual({
				selectedPageType: 'fees-forecasting',
				pageTitle: 'Test section - Test case',
				pageHeading: 'Test page heading',
				fieldName: 'testSection',
				dateFieldName: '',
				additionalFieldName: '',
				hintText: 'Test section hint text',
				componentType: 'date-input',
				radioFieldPath: '',
				dateFieldPath: '',
				radioOptions: [],
				labelText: '',
				additionalLabelText: ''
			});
		});

		it('should return empty strings if values are falsy', async () => {
			const { getSectionData } = await import('../applications-fees-forecasting.utils.js');

			getSectionData.mockReturnValue({
				sectionTitle: 'Test section',
				fieldName: undefined,
				componentType: 'date-input'
			});

			const projectName = null;

			const { getFeesForecastingEditViewModel } = await import(
				'../applications-fees-forecasting-edit.view-model.js'
			);

			const result = getFeesForecastingEditViewModel(projectName, sectionName);

			expect(result).toEqual({
				selectedPageType: 'fees-forecasting',
				pageTitle: '',
				pageHeading: '',
				fieldName: '',
				dateFieldName: '',
				additionalFieldName: '',
				hintText: '',
				componentType: 'date-input',
				radioFieldPath: '',
				dateFieldPath: '',
				radioOptions: [],
				labelText: '',
				additionalLabelText: ''
			});
		});

		it('should return radio-date-input fields when component type is radio-date-input', async () => {
			const { getSectionData } = await import('../applications-fees-forecasting.utils.js');

			getSectionData.mockReturnValue({
				sectionTitle: 'Principal area disagreement summary statement (PADSS)',
				pageHeading: 'Principal area disagreement summary statement (PADSS)',
				fieldName: 'principalAreaDisagreementSummaryStmt',
				dateFieldName: 'principalAreaDisagreementSummaryStmtSubmittedDate',
				componentType: 'radio-date-input',
				radioFieldPath: 'additionalDetails.principalAreaDisagreementSummaryStmt',
				dateFieldPath: 'keyDates.preApplication.principalAreaDisagreementSummaryStmtSubmittedDate'
			});

			const projectName = 'Test case';

			const { getFeesForecastingEditViewModel } = await import(
				'../applications-fees-forecasting-edit.view-model.js'
			);

			const result = getFeesForecastingEditViewModel(projectName, 'disagreement-summary-statement');

			expect(result).toEqual({
				selectedPageType: 'fees-forecasting',
				pageTitle: 'Principal area disagreement summary statement (PADSS) - Test case',
				pageHeading: 'Principal area disagreement summary statement (PADSS)',
				fieldName: 'principalAreaDisagreementSummaryStmt',
				dateFieldName: 'principalAreaDisagreementSummaryStmtSubmittedDate',
				additionalFieldName: '',
				hintText: '',
				componentType: 'radio-date-input',
				radioFieldPath: 'additionalDetails.principalAreaDisagreementSummaryStmt',
				dateFieldPath: 'keyDates.preApplication.principalAreaDisagreementSummaryStmtSubmittedDate',
				radioOptions: [],
				labelText: '',
				additionalLabelText: ''
			});
		});

		it('should return radio-input fields when component type is radio-input', async () => {
			const { getSectionData } = await import('../applications-fees-forecasting.utils.js');

			getSectionData.mockReturnValue({
				sectionTitle: 'Project maturity',
				pageHeading: 'What is the new maturity of the project?',
				fieldName: 'newMaturity',
				componentType: 'radio-input',
				radioFieldPath: 'additionalDetails.newMaturity',
				radioOptions: [
					{ value: 'a', text: 'A' },
					{ value: 'b', text: 'B' },
					{ value: 'c', text: 'C' },
					{ value: 'd', text: 'D' },
					{ value: 'e', text: 'E' },
					{ value: 'f', text: 'F' },
					{ value: 'g', text: 'G' }
				]
			});

			const projectName = 'Test case';

			const { getFeesForecastingEditViewModel } = await import(
				'../applications-fees-forecasting-edit.view-model.js'
			);

			const result = getFeesForecastingEditViewModel(projectName, 'project-maturity');

			expect(result).toEqual({
				selectedPageType: 'fees-forecasting',
				pageTitle: 'Project maturity - Test case',
				pageHeading: 'What is the new maturity of the project?',
				fieldName: 'newMaturity',
				dateFieldName: '',
				hintText: '',
				componentType: 'radio-input',
				radioFieldPath: 'additionalDetails.newMaturity',
				dateFieldPath: '',
				radioOptions: [
					{ value: 'a', text: 'A' },
					{ value: 'b', text: 'B' },
					{ value: 'c', text: 'C' },
					{ value: 'd', text: 'D' },
					{ value: 'e', text: 'E' },
					{ value: 'f', text: 'F' },
					{ value: 'g', text: 'G' }
				],
				labelText: '',
				additionalLabelText: ''
			});
		});

		it('should correctly map data for text-input components to the view model when provided', async () => {
			const { getSectionData } = await import('../applications-fees-forecasting.utils.js');

			getSectionData.mockReturnValue({
				sectionTitle: 'Test section',
				pageHeading: 'Test page heading',
				fieldName: 'testSection',
				additionalFieldName: 'additionalTestSection',
				labelText: 'Test label',
				additionalLabelText: 'Additional test label',
				componentType: 'text-input'
			});

			const projectName = 'Test case';

			const { getFeesForecastingEditViewModel } = await import(
				'../applications-fees-forecasting-edit.view-model.js'
			);

			const result = getFeesForecastingEditViewModel(projectName, sectionName);

			expect(result).toEqual({
				selectedPageType: 'fees-forecasting',
				pageTitle: 'Test section - Test case',
				pageHeading: 'Test page heading',
				fieldName: 'testSection',
				dateFieldName: '',
				additionalFieldName: 'additionalTestSection',
				hintText: '',
				componentType: 'text-input',
				radioFieldPath: '',
				dateFieldPath: '',
				radioOptions: [],
				labelText: 'Test label',
				additionalLabelText: 'Additional test label'
			});
		});
	});
});
