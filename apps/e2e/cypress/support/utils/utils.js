// @ts-nocheck
const { CasePage } = require('../../page_objects/casePage');
const { CreateCasePage } = require('../../page_objects/createCasePage');

const casePage = new CasePage();
const createCasePage = new CreateCasePage();

const validateSummaryPage = (fileIndex, checkType) => {
	const files = ['mainProjectFile', 'secondProjectFile'];
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
};

const validateSummaryPageInfo = (projectInformation, checkType) => {
	const mandatoryOnly = checkType === 'mandatory';

	casePage.validateKeyDates(
		mandatoryOnly ? '' : projectInformation.publishedDate,
		projectInformation.internalDateFull
	);
	casePage.validateSummaryItem('Case reference', Cypress.env('currentCreatedCase'));
	casePage.validateSummaryItem(
		'Applicant Information',
		mandatoryOnly
			? ''
			: `${projectInformation.orgName}${projectInformation.applicantEmail}${projectInformation.applicantPhoneNumber}`
	);
	casePage.validateSummaryItem(
		'Applicant website',
		mandatoryOnly ? '' : projectInformation.applicantWebsite
	);
	casePage.validateSummaryItem(
		'Project email',
		mandatoryOnly ? '' : projectInformation.projectEmail
	);
};

const validateProjectInformation = (page, projectInformation, checkType, updated = false) => {
	const mandatoryOnly = checkType === 'mandatory';
	// P R O J E C T  I N F O R M A T I O N
	casePage.validateSummaryItem('Case reference number', Cypress.env('currentCreatedCase'));
	casePage.validateSummaryItem('Sector', projectInformation.sector);
	casePage.validateSummaryItem('Subsector', projectInformation.subsector);

	// P R O J E C T  D E T A I L S
	casePage.checkProjectAnswer('Project name', projectInformation.projectName);
	casePage.checkProjectAnswer('Project description', projectInformation.projectDescription);
	casePage.checkProjectAnswer(
		'Project email address',
		mandatoryOnly ? '' : projectInformation.projectEmail
	);
	casePage.checkProjectAnswer('Project location', projectInformation.projectLocation);
	casePage.checkProjectAnswer(
		'Grid references',
		`${projectInformation.gridRefEasting} (Easting)${projectInformation.gridRefNorthing} (Northing)`
	);
	// casePage.checkProjectAnswer('Region(s)', projectInformation.regions.join(','));
	casePage.checkProjectAnswer(
		'Map zoom level',
		mandatoryOnly ? 'None' : projectInformation.zoomLevel
	);

	// A P P L I C A T I O N  I N F O R M A T I O N
	casePage.checkProjectAnswer('Organisation name', mandatoryOnly ? '' : projectInformation.orgName);
	casePage.checkProjectAnswer('Website', mandatoryOnly ? '' : projectInformation.applicantWebsite);
	casePage.checkProjectAnswer(
		/^Email address$/,
		mandatoryOnly ? '' : projectInformation.applicantEmail
	);
	casePage.checkProjectAnswer(
		'Telephone number',
		mandatoryOnly ? '' : projectInformation.applicantPhoneNumber
	);

	if (page.toLowerCase() === 'project information') {
		casePage.checkProjectAnswer(
			'Contact name (Internal use only)',
			mandatoryOnly
				? ''
				: `${projectInformation.applicantFirstName}  ${projectInformation.applicantLastName}`
		);
		const address = updated
			? projectInformation.applicantFullAddress2
			: projectInformation.applicantFullAddress;
		casePage.checkProjectAnswer('Address (Internal use only)', mandatoryOnly ? '' : address);
	}
};

const updateProjectInformation = (projectInformation) => {
	casePage.clickChangeLink('Project name');
	casePage.fillInput(projectInformation.projectName);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Project description');
	casePage.fillTextArea(projectInformation.projectDescription);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Project email address');
	casePage.fillInput(projectInformation.projectEmail);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Project location');
	casePage.fillTextArea(projectInformation.projectLocation);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Grid references');
	casePage.fillInput(projectInformation.gridRefEasting);
	casePage.fillInput(projectInformation.gridRefNorthing, 1);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Region(s)');
	casePage.clearAllCheckboxes();
	createCasePage.sections.regions.chooseRegions(projectInformation.regions);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Map zoom level');
	createCasePage.sections.zoomLevel.chooseZoomLevel(projectInformation.zoomLevel);
	casePage.clickButtonByText('Save changes');

	// A P P L I C A T I O N  I N F O R M A T I O N
	casePage.clickChangeLink('Organisation name');
	casePage.fillInput(projectInformation.orgName);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Contact name (Internal use only)');
	casePage.fillInput(projectInformation.applicantFirstName);
	casePage.fillInput(projectInformation.applicantLastName, 1);
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
	casePage.fillInput(projectInformation.postcode2);
	casePage.clickButtonByText('Find address');
	casePage.chooseSelectItemByIndex(1);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Website');
	casePage.fillInput(projectInformation.applicantWebsite);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink(/^Email address$/);
	casePage.fillInput(projectInformation.applicantEmail);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Telephone number');
	casePage.fillInput(projectInformation.applicantPhoneNumber);
	casePage.clickButtonByText('Save changes');
};
module.exports = {
	validateSummaryPage,
	validateSummaryPageInfo,
	validateProjectInformation,
	updateProjectInformation
};
