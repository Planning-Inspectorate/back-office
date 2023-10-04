export const validAppellantCase = {
	appeal: {
		LPACode: 'Q9999',
		LPAName: 'System Test Borough Council',
		appealType: 'Householder (HAS) Appeal',
		isListedBuilding: false,
		decision: 'refused',
		originalCaseDecisionDate: '2023-07-07T13:53:31.6003126+00:00',
		costsAppliedForIndicator: false,
		LPAApplicationReference: 'PL/12367232/B',
		appellant: {
			firstName: 'Paul',
			lastName: 'Pogba',
			emailAddress: 'test@example.com'
		},
		agent: {
			firstName: 'Ray',
			lastName: 'Liotta',
			emailAddress: 'test@example.com'
		},
		siteAddressLine1: '123 Fake Street',
		siteAddressLine2: 'Short Lane',
		siteAddressTown: 'Testville',
		siteAddressCounty: 'Testshire',
		siteAddressPostcode: 'M1 1BB',
		isSiteFullyOwned: true,
		hasToldOwners: true,
		isSiteVisible: true,
		inspectorAccessDetails: 'Small lane from main road',
		doesSiteHaveHealthAndSafetyIssues: true,
		healthAndSafetyIssuesDetails: "There's an american bully onsite"
	},
	documents: [
		{
			filename: 'decision.pdf',
			originalFilename: 'decision.pdf',
			size: 12345,
			mime: 'application/pdf',
			documentURI: 'https://storage.com/published/en010120/v1/filename.pdf',
			dateCreated: '2023-03-26T00:00:00.000Z',
			lastModified: '2023-03-26T00:00:00.000Z',
			documentType: 'decisionLetter',
			sourceSystem: 'appeals',
			origin: 'citizen',
			blobStoragePath: 'en010120/v1/filename.pdf',
			blobStorageContainer: 'published',
			stage: 'appellant_case'
		}
	]
};

export const validLpaQuestionnaire = {
	questionnaire: {
		caseReference: '6000526',
		LPACode: 'Q9999',
		isAppealTypeAppropriate: true,
		doesTheDevelopmentAffectTheSettingOfAListedBuilding: true,
		affectedListedBuildings: [
			{
				listEntry: '1021477'
			}
		],
		inCAOrRelatesToCA: true,
		siteWithinGreenBelt: true,
		howYouNotifiedPeople: [
			'A public notice at the site',
			'Letters to neighbours',
			'Advert in the local press'
		],
		hasRepresentationsFromOtherParties: true,
		doesSiteRequireInspectorAccess: true,
		doPlansAffectNeighbouringSite: true,
		doesSiteHaveHealthAndSafetyIssues: true,
		healthAndSafetyIssuesDetails: 'There are bears. Lots of bears.',
		nearbyCaseReferences: ['abc/123456', 'lpa/945357'],
		hasExtraConditions: true,
		extraConditions: 'Here are some extra conditions.'
	},
	documents: []
};
