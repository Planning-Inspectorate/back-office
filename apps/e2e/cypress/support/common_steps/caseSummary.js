// @ts-nocheck
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { CasePage } from '../../page_objects/casePage';
import { CreateCasePage } from '../../page_objects/createCasePage';

const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const files = ['mainProjectFile', 'secondProjectFile'];

When(/^the user updates the project information with file "(1|2)"$/, function (fileIndex) {
	const projectFileName = Cypress.env(files[fileIndex - 1]);
	cy.fixture(projectFileName).then((file) => {
		// P R O J E C T  D E T A I L S
		casePage.clickChangeLink('Project name');
		casePage.fillInput(file.projectName);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Project description');
		casePage.fillTextArea(file.projectDescription);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Project email address');
		casePage.fillInput(file.projectEmail);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Project location');
		casePage.fillTextArea(file.projectLocation);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Grid references');
		casePage.fillInput(file.gridRefEasting);
		casePage.fillInput(file.gridRefNorthing, 1);
		casePage.clickButtonByText('Save changes');

		// Todo: BUG
		casePage.clickChangeLink('Region(s)');
		casePage.clearAllCheckboxes();
		createCasePage.sections.regions.chooseRegions(file.regions);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Map zoom level');
		createCasePage.sections.zoomLevel.chooseZoomLevel(file.zoomLevel);
		casePage.clickButtonByText('Save changes');

		// A P P L I C A T I O N  I N F O R M A T I O N
		casePage.clickChangeLink('Organisation name');
		casePage.fillInput(file.orgName);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Contact name (Internal use only)');
		casePage.fillInput(file.applicantFirstName);
		casePage.fillInput(file.applicantLastName, 1);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Address (Internal use only)');
		// cy.pause();
		cy.get(casePage.selectors.link)
			.its('length')
			.then((len) => {
				if (len > 2) {
					casePage.clickLinkByText('Change');
				}
			});
		casePage.fillInput(file.postcode2);
		casePage.clickButtonByText('Find address');
		casePage.chooseSelectItemByIndex(1);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Website');
		casePage.fillInput(file.applicantWebsite);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink(/^Email address$/);
		casePage.fillInput(file.applicantEmail);
		casePage.clickButtonByText('Save changes');

		casePage.clickChangeLink('Telephone number');
		casePage.fillInput(file.applicantPhoneNumber);
		casePage.clickButtonByText('Save changes');
	});
});

Then(
	/^the user should validate the "(Preview and Publish|Project information)" page with file "(1|2)" and "(complete|mandatory)" data$/,
	function (page, fileIndex, checkType) {
		const projectFileName = Cypress.env(files[fileIndex - 1]);
		const mandatoryOnly = checkType === 'mandatory';

		cy.fixture(projectFileName).then((file) => {
			// P R O J E C T  I N F O R M A T I O N
			casePage.validateSummaryItem('Case reference number', Cypress.env('currentCreatedCase'));
			casePage.validateSummaryItem('Sector', file.sector);
			casePage.validateSummaryItem('Subsector', file.subsector);

			// P R O J E C T  D E T A I L S
			casePage.checkProjectAnswer('Project name', file.projectName);
			casePage.checkProjectAnswer('Project description', file.projectDescription);
			casePage.checkProjectAnswer('Project email address', mandatoryOnly ? '' : file.projectEmail);
			casePage.checkProjectAnswer('Project location', file.projectLocation);
			casePage.checkProjectAnswer(
				'Grid references',
				`${file.gridRefEasting} (Easting)${file.gridRefNorthing} (Northing)`
			);
			// casePage.checkProjectAnswer('Region(s)', file.regions.join(','));
			casePage.checkProjectAnswer('Map zoom level', mandatoryOnly ? 'None' : file.zoomLevel);

			// A P P L I C A T I O N  I N F O R M A T I O N
			casePage.checkProjectAnswer('Organisation name', mandatoryOnly ? '' : file.orgName);
			casePage.checkProjectAnswer('Website', mandatoryOnly ? '' : file.applicantWebsite);
			casePage.checkProjectAnswer(/^Email address$/, mandatoryOnly ? '' : file.applicantEmail);
			casePage.checkProjectAnswer(
				'Telephone number',
				mandatoryOnly ? '' : file.applicantPhoneNumber
			);

			if (page.toLowerCase() === 'project information') {
				casePage.checkProjectAnswer(
					'Contact name (Internal use only)',
					mandatoryOnly ? '' : `${file.applicantFirstName}  ${file.applicantLastName}`
				);
				const address = files[fileIndex - 1].includes('second')
					? file.applicantFullAddress2
					: file.applicantFullAddress;
				casePage.checkProjectAnswer('Address (Internal use only)', mandatoryOnly ? '' : address);
			}
		});
	}
);

Then(
	/^the user should validate the summary page with file "(1|2)" and "(complete|mandatory)" data$/,
	function (fileIndex, checkType) {
		const mandatoryOnly = checkType === 'mandatory';

		const projectFileName = Cypress.env(files[fileIndex - 1]);
		cy.fixture(projectFileName).then((file) => {
			casePage.validateKeyDates(mandatoryOnly ? '' : file.publishedDate, file.internalDateFull);
			casePage.validateSummaryItem('Case reference', Cypress.env('currentCreatedCase'));
			casePage.validateSummaryItem(
				'Applicant Information',
				mandatoryOnly ? '' : `${file.orgName}${file.applicantEmail}${file.applicantPhoneNumber}`
			);
			casePage.validateSummaryItem('Applicant website', mandatoryOnly ? '' : file.applicantWebsite);
			casePage.validateSummaryItem('Project email', mandatoryOnly ? '' : file.projectEmail);
		});
	}
);

Then(/^the user should not be able to edit the case$/, function () {
	casePage.elements.changeLink('Project name').should('not.exist');
});

Then(/^the user should see a banner message displaying "([^"]*)"$/, function (successMessage) {
	casePage.basePageElements.bannerHeader().then(($banner) => {
		expect($banner.text().trim()).to.equal(successMessage);
	});
});
