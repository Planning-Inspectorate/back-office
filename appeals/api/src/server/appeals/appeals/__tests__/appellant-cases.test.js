import { request } from '../../../app-test.js';
import {
	ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME,
	ERROR_INVALID_REASONS_ONLY_FOR_INVALID_OUTCOME,
	ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME,
	ERROR_MUST_BE_ARRAY_OF_IDS,
	ERROR_MUST_BE_NUMBER,
	ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE,
	ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS,
	ERROR_NOT_FOUND,
	ERROR_OTHER_NOT_VALID_REASONS_REQUIRED,
	ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS,
	ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
} from '../../constants.js';
import {
	appellantCaseIncompleteReasons,
	appellantCaseInvalidReasons,
	fullPlanningAppeal,
	householdAppeal,
	appellantCaseValidationOutcomes
} from '../../tests/data.js';

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

		describe('PATCH', () => {
			test('updates appellant case when the validation outcome is Incomplete with numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);

				const body = {
					incompleteReasons: [1, 2, 3],
					validationOutcome: 'Incomplete',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is incomplete with string array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);

				const body = {
					incompleteReasons: ['1', '2', '3'],
					validationOutcome: 'incomplete',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 1,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is Invalid with numeric array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);

				const body = {
					invalidReasons: [1, 2, 3],
					validationOutcome: 'Invalid',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is invalid with string array', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany.mockResolvedValue(
					true
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany.mockResolvedValue(
					true
				);

				const body = {
					invalidReasons: ['1', '2', '3'],
					validationOutcome: 'invalid',
					otherNotValidReasons: 'Another reason'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 2,
						otherNotValidReasons: 'Another reason'
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is Valid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);

				const body = {
					validationOutcome: 'Valid'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('updates appellant case when the validation outcome is valid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);

				const body = {
					validationOutcome: 'valid'
				};
				const { appellantCase } = householdAppeal;
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/${appellantCase.id}`)
					.send(body);

				expect(databaseConnector.appellantCase.update).toHaveBeenCalledWith({
					where: { id: appellantCase.id },
					data: {
						appellantCaseValidationOutcomeId: 3
					}
				});
				expect(response.status).toEqual(200);
				expect(response.body).toEqual(body);
			});

			test('returns an error if appealId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/one/appellant-cases/${householdAppeal.appellantCase.id}`)
					.send({
						validationOutcome: 'Valid'
					});

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

				const response = await request
					.patch(`/appeals/3/appellant-cases/${householdAppeal.appellantCase.id}`)
					.send({
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appealId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if appellantCaseId is not numeric', async () => {
				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/one`)
					.send({
						validationOutcome: 'Valid'
					});

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

				const response = await request
					.patch(`/appeals/${householdAppeal.id}/appellant-cases/3`)
					.send({
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						appellantCaseId: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not given', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is not given', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_VALID_VALIDATION_OUTCOME_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is not an array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: 1,
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_BE_ARRAY_OF_IDS
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is not an array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: 1,
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_BE_ARRAY_OF_IDS
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons is an empty array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons is an empty array', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [],
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_MUST_CONTAIN_AT_LEAST_1_VALUE
					}
				});
			});

			test('returns an error if validationOutcome is Incomplete and incompleteReasons contains an invalid value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 10],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if validationOutcome is Invalid and invalidReasons contains an invalid value', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 10],
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_NOT_FOUND
					}
				});
			});

			test('returns an error if validationOutcome is invalid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(undefined);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Complete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						validationOutcome: ERROR_INVALID_APPELLANT_CASE_VALIDATION_OUTCOME
					}
				});
			});

			test('returns an error if otherNotValidReasons is not given when validationOutcome is Incomplete and Other is selected', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 2, 3],
						validationOutcome: 'Incomplete'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_OTHER_NOT_VALID_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if otherNotValidReasons is not given when validationOutcome is Invalid and Other is selected', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 2, 3],
						validationOutcome: 'Invalid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_OTHER_NOT_VALID_REASONS_REQUIRED
					}
				});
			});

			test('returns an error if otherNotValidReasons is given when validationOutcome is Incomplete and Other is not selected', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[0]
				);
				// @ts-ignore
				databaseConnector.appellantCaseIncompleteReason.findMany.mockResolvedValue(
					appellantCaseIncompleteReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 2],
						validationOutcome: 'Incomplete',
						otherNotValidReasons: 'Another reason'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS
					}
				});
			});

			test('returns an error if otherNotValidReasons is given when validationOutcome is Invalid and Other is not selected', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[1]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 2],
						validationOutcome: 'Invalid',
						otherNotValidReasons: 'Another reason'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_MUST_NOT_CONTAIN_VALIDATION_OUTCOME_REASONS
					}
				});
			});

			test('returns an error if incompleteReasons is given when validationOutcome is not Incomplete', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						incompleteReasons: [1, 2],
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						incompleteReasons: ERROR_INCOMPLETE_REASONS_ONLY_FOR_INCOMPLETE_OUTCOME
					}
				});
			});

			test('returns an error if invalidReasons is given when validationOutcome is not Invalid', async () => {
				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						invalidReasons: [1, 2],
						validationOutcome: 'Valid'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						invalidReasons: ERROR_INVALID_REASONS_ONLY_FOR_INVALID_OUTCOME
					}
				});
			});

			test('returns an error if otherNotValidReasons is given when validationOutcome is Valid', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findUnique.mockResolvedValue(
					appellantCaseValidationOutcomes[2]
				);
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const response = await request
					.patch(
						`/appeals/${householdAppeal.id}/appellant-cases/${householdAppeal.appellantCase.id}`
					)
					.send({
						validationOutcome: 'Valid',
						otherNotValidReasons: 'Another reason'
					});

				expect(response.status).toEqual(400);
				expect(response.body).toEqual({
					errors: {
						otherNotValidReasons: ERROR_VALID_VALIDATION_OUTCOME_NO_REASONS
					}
				});
			});
		});
	});
});
