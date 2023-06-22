import { request } from '../../../app-test.js';
import { ERROR_MUST_BE_NUMBER, ERROR_NOT_FOUND } from '../../constants.js';
import { householdAppeal } from '../../tests/data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

describe('lpa questionnaires routes', () => {
	describe('/appeals/:appealId/lpa-questionnaires/:lpaQuestionnaireId', () => {
		describe('GET', () => {
			test('gets a single lpa questionnaire', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { lpaQuestionnaire } = householdAppeal;
				const response = await request.get(
					`/appeals/${householdAppeal.id}/lpa-questionnaires/${lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual({
					affectsListedBuildingDetails: [
						{
							grade: lpaQuestionnaire.listedBuildingDetails[1].grade,
							description: lpaQuestionnaire.listedBuildingDetails[1].description
						}
					],
					appealId: householdAppeal.id,
					appealReference: householdAppeal.reference,
					appealSite: {
						addressLine1: householdAppeal.address.addressLine1,
						town: householdAppeal.address.town,
						county: householdAppeal.address.county,
						postCode: householdAppeal.address.postcode
					},
					communityInfrastructureLevyAdoptionDate:
						lpaQuestionnaire.communityInfrastructureLevyAdoptionDate,
					designatedSites: lpaQuestionnaire.designatedSites.map(
						({ designatedSite: { name, description } }) => ({ name, description })
					),
					developmentDescription: lpaQuestionnaire.developmentDescription,
					documents: {
						communityInfrastructureLevy: 'community-infrastructure-levy.pdf',
						conservationAreaMapAndGuidance: 'conservation-area-map-and-guidance.pdf',
						consultationResponses: 'consultation-responses.pdf',
						definitiveMapAndStatement: 'right-of-way.pdf',
						emergingPlans: ['emerging-plan-1.pdf'],
						environmentalStatementResponses: 'environment-statement-responses.pdf',
						issuedScreeningOption: 'issued-screening-opinion.pdf',
						lettersToNeighbours: 'letters-to-neighbours.pdf',
						otherRelevantPolicies: ['policy-1.pdf'],
						planningOfficersReport: 'planning-officers-report.pdf',
						policiesFromStatutoryDevelopment: ['policy-a.pdf'],
						pressAdvert: 'press-advert.pdf',
						representationsFromOtherParties: ['representations-from-other-parties-1.pdf'],
						responsesOrAdvice: ['responses-or-advice.pdf'],
						screeningDirection: 'screening-direction.pdf',
						siteNotice: 'site-notice.pdf',
						supplementaryPlanningDocuments: ['supplementary-1.pdf'],
						treePreservationOrder: 'tree-preservation-order.pdf'
					},
					doesAffectAListedBuilding: lpaQuestionnaire.doesAffectAListedBuilding,
					doesAffectAScheduledMonument: lpaQuestionnaire.doesAffectAScheduledMonument,
					doesSiteHaveHealthAndSafetyIssues: lpaQuestionnaire.doesSiteHaveHealthAndSafetyIssues,
					doesSiteRequireInspectorAccess: lpaQuestionnaire.doesSiteRequireInspectorAccess,
					extraConditions: lpaQuestionnaire.extraConditions,
					hasCommunityInfrastructureLevy: lpaQuestionnaire.hasCommunityInfrastructureLevy,
					hasCompletedAnEnvironmentalStatement:
						lpaQuestionnaire.hasCompletedAnEnvironmentalStatement,
					hasEmergingPlan: lpaQuestionnaire.hasEmergingPlan,
					hasExtraConditions: lpaQuestionnaire.hasExtraConditions,
					hasProtectedSpecies: lpaQuestionnaire.hasProtectedSpecies,
					hasRepresentationsFromOtherParties: lpaQuestionnaire.hasRepresentationsFromOtherParties,
					hasResponsesOrStandingAdviceToUpload:
						lpaQuestionnaire.hasResponsesOrStandingAdviceToUpload,
					hasStatementOfCase: lpaQuestionnaire.hasStatementOfCase,
					hasStatutoryConsultees: lpaQuestionnaire.hasStatutoryConsultees,
					hasSupplementaryPlanningDocuments: lpaQuestionnaire.hasSupplementaryPlanningDocuments,
					hasTreePreservationOrder: lpaQuestionnaire.hasTreePreservationOrder,
					inCAOrrelatesToCA: lpaQuestionnaire.inCAOrrelatesToCA,
					includesScreeningOption: lpaQuestionnaire.includesScreeningOption,
					isCommunityInfrastructureLevyFormallyAdopted:
						lpaQuestionnaire.isCommunityInfrastructureLevyFormallyAdopted,
					isEnvironmentalStatementRequired: lpaQuestionnaire.isEnvironmentalStatementRequired,
					isGypsyOrTravellerSite: lpaQuestionnaire.isGypsyOrTravellerSite,
					isListedBuilding: lpaQuestionnaire.isListedBuilding,
					isPublicRightOfWay: lpaQuestionnaire.isPublicRightOfWay,
					isSensitiveArea: lpaQuestionnaire.isSensitiveArea,
					isSiteVisible: lpaQuestionnaire.isSiteVisible,
					isTheSiteWithinAnAONB: lpaQuestionnaire.isTheSiteWithinAnAONB,
					listedBuildingDetails: [
						{
							grade: lpaQuestionnaire.listedBuildingDetails[0].grade,
							description: lpaQuestionnaire.listedBuildingDetails[0].description
						}
					],
					localPlanningDepartment: householdAppeal.localPlanningDepartment,
					lpaNotificationMethods: lpaQuestionnaire.lpaNotificationMethods.map(
						({ lpaNotificationMethod: { name } }) => ({ name })
					),
					lpaQuestionnaireId: lpaQuestionnaire.id,
					meetsOrExceedsThresholdOrCriteriaInColumn2:
						lpaQuestionnaire.meetsOrExceedsThresholdOrCriteriaInColumn2,
					otherAppeals: [
						{
							appealId: 1,
							appealReference: 'APP/Q9999/D/21/725284'
						}
					],
					procedureType: lpaQuestionnaire.procedureType.name,
					scheduleType: lpaQuestionnaire.scheduleType.name,
					siteWithinGreenBelt: lpaQuestionnaire.siteWithinGreenBelt
				});
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request.get(
					`/appeals/one/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
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
					`/appeals/3/lpa-questionnaires/${householdAppeal.lpaQuestionnaire.id}`
				);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if lpaQuestionnaireId is not numeric', async () => {
				const response = await request.get(`/appeals/${householdAppeal.id}/lpa-questionnaires/one`);

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireId: ERROR_MUST_BE_NUMBER
					}
				});
			});

			test('returns an error if lpaQuestionnaireId is not found', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const response = await request.get(`/appeals/${householdAppeal.id}/lpa-questionnaires/3`);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						lpaQuestionnaireId: ERROR_NOT_FOUND
					}
				});
			});
		});
	});
});
