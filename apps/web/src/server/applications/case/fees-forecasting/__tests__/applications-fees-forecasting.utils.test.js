import { getSectionData } from '../applications-fees-forecasting.utils.js';
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
});
