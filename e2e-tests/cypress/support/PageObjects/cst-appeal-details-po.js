export const visitAppealDetailsPage = () => cy.visit('/appeal-details');
export const viewAppealDetailsPage = () => cy.url();
export const pageAppealDetailsTitle = () => cy.title().should('eq', 'Search results - Appeal a householder planning decision - GOV.UK');
export const viewAppealSiteAddress = () => cy.get('.govuk-summary-list');
export const headerSectionSummary = () => cy.get('#summary');
export const localPlanningDepartment = () => cy.get('.govuk-summary-list');
export const viewTextCaseFile = () => cy.get('#case-file');
export const viewTextKeyDates = () => cy.get('#key-dates');
export const applicationDecisionDate = () => cy.findAllByText('Application decision date');
export const appealSubmissiondate = () => cy.findAllByText('Appeal submission date');
export const validationDate = () => cy.findAllByText('Validation date');
export const validDate = () => cy.findAllByText('Valid date');
export const viewTextContactDetails = () => cy.get('#contact-details');
export const viewAppellantName = () => cy.findAllByText('Appellant');
export const viewAgentName = () => cy.findAllByText('Agent');
export const viewTextValidationOfficer = () => cy.findAllByText('Validation officer');
export const viewTextCaseOfficer = () => cy.findAllByText('Case officer');
export const viewTextInspector = () => cy.findAllByText('Inspector');

export const headerCaseDetails = () => cy.findAllByText('Case details');
export const viewAppellantNameEvidence = () => cy.findAllByText('Appellant name');
export const viewAgentNameEvidence = () => cy.findAllByText('Agent name');
export const viewAppellantEmailAddress = () => cy.findAllByText('Contact email address');
export const dateAppealReceivedEvidence = () => cy.findAllByText('Date appeal received');
export const descriptionOfDevelopmentEvidence = () => cy.findAllByText('Description of development');

export const headerAppellantCase = () => cy.findAllByText('Appellant case');
export const appealStatementAppellantCase = () => cy.findAllByText('Appeal statement');
export const supportingDocumentsAppellantCase = () => cy.findAllByText('Supporting documents');

export const headerLocalPlanningDepartmentDocuments = () => cy.findAllByText('Local planning department documents');
export const labelPlansUsedToReachDecision = () => cy.findAllByText('Plans used to reach decision');
export const labelPlanningApplicationForm = () => cy.findAllByText('Planning application form');

export const  labelPlanningOfficersReport = () => cy.findAllByText('Planning Officers report');
export const  labelDecisionNotice = () => cy.findAllByText('Decision notice');
export const  labelExtraConditions = () => cy.findAllByText('Extra conditions');
export const  labelDetailsOfPlanningHistory = () => cy.findAllByText('Details of planning history');
export const  labelSupportingDocuments = () => cy.findAllByText('Supporting documents');
export const linkSupportingDocs = () => cy.get('#accordion-default-content-2').findByText('Supporting documents');

export const headerConstraints = () => cy.findAllByText('Constraints');
export const  labelAffectsListedBuilding = () => cy.findAllByText('Affects listed building');
export const  labelInGreenBelt = () => cy.findAllByText('In green belt');
export const  labelInOrNearAConservationArea = () => cy.findAllByText('In or near a conservation area');

export const headerPolicies = () => cy.findAllByText('Policies');
export const labelStatutoryDevelopmentPlanPolicy = () => cy.findAllByText('Statutory development plan policy');
export const labelOtherRelevantPolicies = () => cy.findAllByText('Other relevant policies');
export const labelSupplementaryPlanningDocuments = () => cy.findAllByText('Supplementary planning documents');
export const labelEmergingDevelopmentPlanOrNeighbourhoodPlan = () => cy.findAllByText('Emerging development plan or neighbourhood plan');

export const headerRepresentation = () => cy.findAllByText('Representation');
export const labelRepresentations = () => cy.findAllByText('Representations');

export const headerCorrespondence = () => cy.findAllByText('Correspondence');
export const labelApplicationNotification = () => cy.findAllByText('Application notification');
export const labelApplicationPublicity = () => cy.findAllByText('Application publicity');
export const labelAppealNotification = () => cy.findAllByText('Appeal notification');

export const buttonCaseDetails = () => cy.get('#accordion-default-heading-1');
export const buttonAppellantCase = () => cy.get('#accordion-default-heading-2');
export const buttonLPDDocuments = () => cy.get('#accordion-default-heading-3');
export const buttonConstraints = () => cy.get('#accordion-default-heading-4');
export const buttonPolicies = () => cy.get('#accordion-default-heading-5');
export const buttonRepresentations = () => cy.get('#accordion-default-heading-6');
export const buttonCorrespondence = () => cy.get('#accordion-default-heading-7');

export const headerStages = () => cy.findAllByText('Stages');
export const headerValidation = () => cy.findAllByText('Validation');
export const validationOutcome = () => cy.xpath('//div[@id="validation"]//dt[contains(text(),"Outcome")]');
export const validationTimeStamp = () => cy.xpath('//div[@id="validation"]//dt[contains(text(),"Timestamp")]');
export const validationOfficer = () => cy.xpath('//div[@id="validation"]//dt[contains(text(),"Validation officer")]');

export const headerStart = () => cy.findAllByText('Start');
export const startOutcome = () => cy.xpath('//div[@id="start"]//dt[contains(text(),"Outcome")]');
export const startTimeStamp = () => cy.xpath('//div[@id="start"]//dt[contains(text(),"Timestamp")]');
export const startCaseOfficer = () => cy.xpath('//div[@id="start"]//dt[contains(text(),"Case officer")]');

export const headerQuestionnaire = () => cy.findAllByText('Questionnaire');
export const questionnaireStatus = () => cy.xpath('//div[@id="questionnaire"]//dt[contains(text(),"Status")]');
export const questionnaireOutcome = () => cy.xpath('//div[@id="questionnaire"]//dt[contains(text(),"Outcome")]');
export const questionnaireTimeStamp = () => cy.xpath('//div[@id="questionnaire"]//dt[contains(text(),"Timestamp")]');
export const questionnaireCaseOfficer = () => cy.xpath('//div[@id="questionnaire"]//dt[contains(text(),"Case officer")]');

export const headerSiteVisit = () => cy.findAllByText('Site visit');
export const siteVisitProvisionalType = () => cy.xpath('//div[@id="site-visit"]//dt[contains(text(),"Provisional type")]');
export const siteVisitConfirmedType = () => cy.xpath('//div[@id="site-visit"]//dt[contains(text(),"Confirmed type")]');
export const siteVisitDate = () => cy.xpath('//div[@id="site-visit"]//dt[contains(text(),"Date")]');
export const siteVisitTime = () => cy.xpath('//div[@id="site-visit"]//dt[contains(text(),"Time")]');

export const headerDecision = () => cy.findAllByText('Decision');
export const decisionOutcome = () => cy.xpath('//div[@id="decision"]//dt[contains(text(),"Outcome")]');
export const decisionDateOfDecision = () => cy.xpath('//div[@id="decision"]//dt[contains(text(),"Date of decision")]');
export const decisionReport = () => cy.xpath('//div[@id="decision"]//dt[contains(text(),"Decision report")]');
export const decisionState = () => cy.xpath('//div[@id="decision"]//dt[contains(text(),"State")]');