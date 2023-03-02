// @ts-nocheck
import { Page } from './basePage';
import { CheckYourAnswersSection } from './createCaseSections/checkYourAnswers';
import * as sections from './createCaseSections/index';

export class CreateCasePage extends Page {
	sections = {
		applicantAddress: new sections.ApplicantAddressSection(),
		applicantEmail: new sections.ApplicantEmailSection(),
		applicantInformationAvailable: new sections.ApplicantInformationAvailableSection(),
		applicantName: new sections.ApplicantNameSection(),
		applicantOrganisation: new sections.ApplicantOrganisationSection(),
		applicantPhoneNumber: new sections.ApplicantPhoneNumberSection(),
		applicantWebsite: new sections.ApplicantWebsiteSection(),
		caseCreated: new sections.CaseCreatedSection(),
		checkYourAnswers: new CheckYourAnswersSection(),
		geographicalInformation: new sections.GeographicalInformationSection(),
		keyDates: new sections.KeyDatesSection(),
		nameAndDescription: new sections.NameAndDescriptionSection(),
		projectEmail: new sections.ProjectEmailSection(),
		regions: new sections.RegionsSection(),
		sector: new sections.SectorSection(),
		subSector: new sections.SubSectorSection(),
		zoomLevel: new sections.ZoomLevelSection()
	};

	createCase(projectInformation, mandatoryOnly = false) {
		cy.visit('/');
		this.clickButtonByText('Create new case here');
		this.sections.nameAndDescription.fillCaseName(projectInformation.projectName);
		this.sections.nameAndDescription.fillCaseDescription(projectInformation.projectDescription);
		this.clickSaveAndContinue();
		this.sections.sector.chooseSector(projectInformation.sector);
		this.clickSaveAndContinue();
		this.sections.subSector.chooseSubsector(
			projectInformation.sector,
			projectInformation.subsector
		);
		this.clickSaveAndContinue();
		this.sections.geographicalInformation.fillLocation(projectInformation.projectLocation);
		this.sections.geographicalInformation.fillEastingGridRef(projectInformation.gridRefEasting);
		this.sections.geographicalInformation.fillNorthingGridRef(projectInformation.gridRefNorthing);
		this.clickSaveAndContinue();
		this.sections.regions.chooseRegions(projectInformation.regions);
		this.clickSaveAndContinue();
		this.sections.zoomLevel.chooseZoomLevel(projectInformation.zoomLevel);
		this.clickSaveAndContinue();
		this.sections.projectEmail.fillCaseEmail(projectInformation.projectEmail);
		this.clickSaveAndContinue();
		this.sections.applicantInformationAvailable.chooseAll();
		this.clickSaveAndContinue();
		this.sections.applicantOrganisation.fillOrganisationName(projectInformation.orgName);
		this.clickSaveAndContinue();
		this.sections.applicantName.fillApplicantFirstName(projectInformation.applicantFirstName);
		this.sections.applicantName.fillApplicantLastName(projectInformation.applicantLastName);
		this.clickSaveAndContinue();
		this.sections.applicantAddress.fillApplicantPostcode(projectInformation.postcode);
		this.clickButtonByText('Find address');
		this.chooseSelectItemByIndex(1);
		this.clickSaveAndContinue();
		this.sections.applicantWebsite.fillApplicantWebsite(projectInformation.applicantWebsite);
		this.clickSaveAndContinue();
		this.sections.applicantEmail.fillApplicantEmail(projectInformation.applicantEmail);
		this.clickSaveAndContinue();
		this.sections.applicantPhoneNumber.fillPhoneNumber(projectInformation.applicantPhoneNumber);
		this.clickSaveAndContinue();
		this.sections.keyDates.fillSumbissionPublishedDate(projectInformation.publishedDate);
		this.sections.keyDates.fillInternalAnticipatedDay(projectInformation.internalDateDay);
		this.sections.keyDates.fillInternalAnticipatedMonth(projectInformation.internalDateMonth);
		this.sections.keyDates.fillInternalAnticipatedYear(projectInformation.internalDateYear);
		this.clickSaveAndContinue();
		this.clickButtonByText('I accept - confirm creation of a new case');
		this.sections.caseCreated.validateCaseCreated();
	}
}
