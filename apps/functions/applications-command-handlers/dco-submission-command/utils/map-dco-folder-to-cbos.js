export const mapDCOCategoryToCBOSFolder = (dcoFolderName) => {
	switch (dcoFolderName) {
		case 'application-form-related-information':
			return 'Application form';

		case 'plans-and-drawings':
			return 'Plans';

		case 'draft-dco':
			return 'DCO documents';

		case 'compulsory-acquisition-information':
			return 'Compulsory acquisition information';

		case 'consultation-report':
		case 'reports-and-statements':
			return 'Reports';

		case 'environmental-statement':
			return 'Environmental statement';

		case 'additional-prescribed-information':
			return 'Additional Reg 6 information';

		case 'other-documents':
			return 'Other documents';

		default:
			return 'Other documents';
	}
};
