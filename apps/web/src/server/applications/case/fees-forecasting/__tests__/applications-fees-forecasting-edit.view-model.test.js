//@ts-nocheck
import { jest } from '@jest/globals';

describe('applications fees forecasting edit view model', () => {
	describe('#getFeesForecastingEditViewModel', () => {
		const sectionName = 'test-section';

		jest.unstable_mockModule(
			'./src/server/applications/case/fees-forecasting/applications-fees-forecasting.utils.js',
			() => {
				const mockGetSectionData = jest.fn();

				return {
					__esModule: true,
					getSectionData: mockGetSectionData
				};
			}
		);

		it('should return the section data mapped to the edit page view model', async () => {
			const { getSectionData } = await import('../applications-fees-forecasting.utils.js');

			getSectionData.mockReturnValue({
				sectionTitle: 'Test section',
				pageHeading: 'Test page heading',
				fieldName: 'testSection',
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
				componentType: 'date-input'
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
				componentType: 'date-input'
			});
		});
	});
});
