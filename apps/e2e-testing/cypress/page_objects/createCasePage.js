import * as sections from './createCaseSections/index';

export class CreateCasePage {
	sections = {
		applicantAddress: new sections.ApplicantAddressSection(),
		applicantEmail: new sections.ApplicantEmailSection(),
		applicantInformationAvailable: new sections.ApplicantInformationAvailableSection(),
		applicantName: new sections.ApplicantNameSection(),
		applicantOrganisation: new sections.ApplicantOrganisationSection(),
		applicantPhoneNumber: new sections.ApplicantPhoneNumberSection(),
		applicantWebsite: new sections.ApplicantWebsiteSection(),
		caseCreated: new sections.CaseCreatedSection(),
		geographicalInformation: new sections.GeographicalInformationSection(),
		keyDates: new sections.KeyDatesSection(),
		nameAndDescription: new sections.NameAndDescriptionSection(),
		projectEmail: new sections.ProjectEmailSection(),
		regions: new sections.RegionsSection(),
		sector: new sections.SectorSection(),
		subSector: new sections.SubSectorSection()
	};
}
