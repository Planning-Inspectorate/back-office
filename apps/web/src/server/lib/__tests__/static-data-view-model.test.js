import { getIsMaterialChangeStaticDataViewModel } from '../static-data-view-models.js';

describe('/apps/web/src/server/lib/static-data-view-models.js', () => {
	describe('#getIsMaterialChangeStaticDataViewModel', () => {
		describe('When the is material change value is false', () => {
			const isMaterialChange = false;
			const isMaterialChangeStaticDataViewModel =
				getIsMaterialChangeStaticDataViewModel(isMaterialChange);

			it('should return the is material change static data view model with the false value checked', () => {
				expect(isMaterialChangeStaticDataViewModel).toEqual([
					{
						text: 'Yes',
						value: 'true',
						checked: false
					},
					{
						text: 'No',
						value: 'false',
						checked: true
					}
				]);
			});
		});

		describe('When the is material change value is true', () => {
			const isMaterialChange = true;
			const isMaterialChangeStaticDataViewModel =
				getIsMaterialChangeStaticDataViewModel(isMaterialChange);

			it('should return the is material change static data view model with the true value checked', () => {
				expect(isMaterialChangeStaticDataViewModel).toEqual([
					{
						text: 'Yes',
						value: 'true',
						checked: true
					},
					{
						text: 'No',
						value: 'false',
						checked: false
					}
				]);
			});
		});
	});
});
