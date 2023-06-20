import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { ERROR_MUST_BE_NUMBER, ERROR_NOT_FOUND } from '../../constants.js';
import { fullPlanningAppeal, householdAppeal } from '../../tests/data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('appellant cases routes', () => {
	describe('/appeals/:appealId/appellant-cases/:appellantCaseId', () => {
		describe('GET', () => {
			test('gets a single appellant case for a household appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { appellantCase } = householdAppeal;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					appealId: householdAppeal.id,
					appealReference: householdAppeal.reference,
					appealSite: {
						addressLine1: householdAppeal.address.addressLine1,
						town: householdAppeal.address.town,
						county: householdAppeal.address.county,
						postCode: householdAppeal.address.postcode
					},
					appellantCaseId: appellantCase.id,
					appellant: {
						name: householdAppeal.appellant.name,
						company: householdAppeal.appellant.company
					},
					applicant: {
						firstName: appellantCase.applicantFirstName,
						surname: appellantCase.applicantSurname
					},
					documents: {
						appealStatement: 'appeal-statement.pdf',
						applicationForm: 'application-form.pdf',
						decisionLetter: 'decision-letter.pdf',
						newSupportingDocuments: [
							'new-supporting-documents-1.pdf',
							'new-supporting-documents-2.pdf'
						]
					},
					hasAdvertisedAppeal: appellantCase.hasAdvertisedAppeal,
					hasNewSupportingDocuments: appellantCase.hasNewSupportingDocuments,
					healthAndSafety: {
						details: appellantCase.healthAndSafetyIssues,
						hasIssues: appellantCase.hasHealthAndSafetyIssues
					},
					isAppellantNamedOnApplication: appellantCase.isAppellantNamedOnApplication,
					localPlanningDepartment: householdAppeal.localPlanningDepartment,
					planningApplicationReference: '48269/APP/2021/1482',
					procedureType: fullPlanningAppeal.lpaQuestionnaire.procedureType.name,
					siteOwnership: {
						areAllOwnersKnown: appellantCase.areAllOwnersKnown,
						hasAttemptedToIdentifyOwners: appellantCase.hasAttemptedToIdentifyOwners,
						hasToldOwners: appellantCase.hasToldOwners,
						isFullyOwned: appellantCase.isSiteFullyOwned,
						isPartiallyOwned: appellantCase.isSitePartiallyOwned,
						knowsOtherLandowners: appellantCase.knowledgeOfOtherLandowners.name
					},
					visibility: {
						details: appellantCase.visibilityRestrictions,
						isVisible: appellantCase.isSiteVisibleFromPublicRoad
					}
				});
			});

			test('gets a single appellant case for a full planning appeal', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(fullPlanningAppeal);

				const { appellantCase } = fullPlanningAppeal;
				const response = await request.get(
					`/appeals/${fullPlanningAppeal.id}/appellant-cases/${appellantCase.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					agriculturalHolding: {
						isAgriculturalHolding: appellantCase.isAgriculturalHolding,
						isTenant: appellantCase.isAgriculturalHoldingTenant,
						hasToldTenants: appellantCase.hasToldTenants,
						hasOtherTenants: appellantCase.hasOtherTenants
					},
					appealId: fullPlanningAppeal.id,
					appealReference: fullPlanningAppeal.reference,
					appealSite: {
						addressLine1: fullPlanningAppeal.address.addressLine1,
						town: fullPlanningAppeal.address.town,
						county: fullPlanningAppeal.address.county,
						postCode: fullPlanningAppeal.address.postcode
					},
					appellantCaseId: appellantCase.id,
					appellant: {
						name: fullPlanningAppeal.appellant.name,
						company: fullPlanningAppeal.appellant.company
					},
					applicant: {
						firstName: appellantCase.applicantFirstName,
						surname: appellantCase.applicantSurname
					},
					developmentDescription: {
						isCorrect: appellantCase.isDevelopmentDescriptionStillCorrect,
						details: appellantCase.newDevelopmentDescription
					},
					documents: {
						appealStatement: 'appeal-statement.pdf',
						applicationForm: 'application-form.pdf',
						decisionLetter: 'decision-letter.pdf',
						designAndAccessStatement: 'design-and-access-statement.pdf',
						newPlansOrDrawings: ['new-plans-or-drawings-1.pdf', 'new-plans-or-drawings-2.pdf'],
						newSupportingDocuments: [
							'new-supporting-documents-1.pdf',
							'new-supporting-documents-2.pdf'
						],
						planningObligation: 'planning-obligation.pdf',
						plansDrawingsSupportingDocuments: [
							'plans-drawings-supporting-documents-1.pdf',
							'plans-drawings-supporting-documents-2.pdf'
						],
						separateOwnershipCertificate: 'separate-ownership-certificate.pdf'
					},
					hasAdvertisedAppeal: appellantCase.hasAdvertisedAppeal,
					hasDesignAndAccessStatement: appellantCase.hasDesignAndAccessStatement,
					hasNewPlansOrDrawings: appellantCase.hasNewPlansOrDrawings,
					hasNewSupportingDocuments: appellantCase.hasNewSupportingDocuments,
					hasSeparateOwnershipCertificate: appellantCase.hasSeparateOwnershipCertificate,
					healthAndSafety: {
						details: appellantCase.healthAndSafetyIssues,
						hasIssues: appellantCase.hasHealthAndSafetyIssues
					},
					isAppellantNamedOnApplication: appellantCase.isAppellantNamedOnApplication,
					localPlanningDepartment: fullPlanningAppeal.localPlanningDepartment,
					planningApplicationReference: '48269/APP/2021/1482',
					planningObligation: {
						hasObligation: appellantCase.hasPlanningObligation,
						status: appellantCase.planningObligationStatus.name
					},
					procedureType: fullPlanningAppeal.lpaQuestionnaire.procedureType.name,
					siteOwnership: {
						areAllOwnersKnown: appellantCase.areAllOwnersKnown,
						hasAttemptedToIdentifyOwners: appellantCase.hasAttemptedToIdentifyOwners,
						hasToldOwners: appellantCase.hasToldOwners,
						isFullyOwned: appellantCase.isSiteFullyOwned,
						isPartiallyOwned: appellantCase.isSitePartiallyOwned,
						knowsOtherLandowners: appellantCase.knowledgeOfOtherLandowners.name
					},
					visibility: {
						details: appellantCase.visibilityRestrictions,
						isVisible: appellantCase.isSiteVisibleFromPublicRoad
					}
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get(
					`/appeals/one/appellant-cases/${householdAppeal.appellantCase.id}`
				);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appealId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(null);

				const response = await request.get(
					`/appeals/3/appellant-cases/${householdAppeal.appellantCase.id}`
				);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantCaseId is not numeric', async () => {
				const response = await request.get(`/appeals/${householdAppeal.id}/appellant-cases/one`);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if appellantCaseId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.get(`/appeals/${householdAppeal.id}/appellant-cases/3`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_NOT_FOUND
					}
				});
			});
		});
	});
});
