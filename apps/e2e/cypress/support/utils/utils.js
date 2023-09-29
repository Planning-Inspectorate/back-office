// @ts-nocheck
const { CasePage } = require('../../page_objects/casePage');
const { CreateCasePage } = require('../../page_objects/createCasePage');
const { faker } = require('@faker-js/faker');

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

const validateProjectOverview = (projectInformation, checkType) => {
	const mandatoryOnly = checkType === 'mandatory';
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
	casePage.validateSummaryItem('Project page', projectInformation.defaultPublishedStatus);
};

const validateProjectInformationSection = (projectInformation) => {
	casePage.checkProjectAnswer('Case reference number', Cypress.env('currentCreatedCase'));
	casePage.checkProjectAnswer('Sector', projectInformation.sector);
	casePage.checkProjectAnswer('Subsector', projectInformation.subsector);
	casePage.checkProjectAnswer('Case stage', '');
};

const validateProjectDetailsSection = (projectInformation) => {
	casePage.checkProjectAnswer('Project description', projectInformation.projectDescription);
	casePage.checkProjectAnswer(/^Email address$/, projectInformation.applicantEmail);
	casePage.checkProjectAnswer('Project location', projectInformation.projectLocation);
	casePage.checkProjectAnswer(
		'Grid references',
		`${projectInformation.gridRefEasting} (Easting)${projectInformation.gridRefNorthing} (Northing)`
	);
	casePage.checkProjectAnswer('Region(s)', projectInformation.regions.join(','));
	casePage.checkProjectAnswer('Map zoom level', projectInformation.zoomLevel);
};

const validateApplicatInfoSection = (projectInformation, updated = false) => {
	casePage.checkProjectAnswer('Organisation name', projectInformation.orgName);
	casePage.checkProjectAnswer('Website', projectInformation.applicantWebsite);
	casePage.checkProjectAnswer(/^Email address$/, projectInformation.applicantEmail);
	casePage.checkProjectAnswer('Telephone number', projectInformation.applicantPhoneNumber);
	casePage.checkProjectAnswer(
		'Contact name (Internal use only)',
		`${projectInformation.applicantFirstName}  ${projectInformation.applicantLastName}`
	);
	const address = updated
		? projectInformation.applicantFullAddress2
		: projectInformation.applicantFullAddress;
	casePage.checkProjectAnswer('Address (Internal use only)', mandatoryOnly ? '' : address);
};

const validateProjectInformation = (page, projectInformation, checkType, updated = false) => {
	const mandatoryOnly = checkType === 'mandatory';

	validateProjectInformationSection(projectInformation);
	validateProjectDetailsSection(projectInformation);
	validateApplicatInfoSection(projectInformation);

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

const validatePreviewAndPublishInfo = (projectInformation) => {
	// P R O J E C T  I N F O R M A T I O N
	casePage.checkProjectAnswer('Case reference number', Cypress.env('currentCreatedCase'));
	casePage.checkProjectAnswer('Sector', projectInformation.sector);
	casePage.checkProjectAnswer('Subsector', projectInformation.subsector);
	casePage.checkProjectAnswer('Case stage', '');
	casePage.checkProjectAnswer('Project description', projectInformation.projectDescription);
	casePage.checkProjectAnswer(/^Email address$/, projectInformation.applicantEmail);
	casePage.checkProjectAnswer('Project location', projectInformation.projectLocation);
	casePage.checkProjectAnswer(
		'Grid references',
		`${projectInformation.gridRefEasting} (Easting)${projectInformation.gridRefNorthing} (Northing)`
	);
	casePage.checkProjectAnswer('Region(s)', projectInformation.regions.join(','));
	casePage.checkProjectAnswer('Map zoom level', projectInformation.zoomLevel);

	// A P P L I C A T I O N  I N F O R M A T I O N
	casePage.checkProjectAnswer('Organisation name', projectInformation.orgName);
	casePage.checkProjectAnswer('Website', projectInformation.applicantWebsite);
	casePage.checkProjectAnswer(/^Email address$/, projectInformation.applicantEmail);
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

const getShortMonthName = (monthNumber) => {
	const date = new Date();
	date.setMonth(monthNumber - 1);
	return date.toLocaleString('default', { month: 'short' });
};

const enquirerString = (details) => {
	const hasName = details.firstName && details.lastName;
	const hasOrg = details.organisation;
	if (hasName && hasOrg) {
		return `${details.firstName} ${details.lastName}, ${details.organisation}`;
	}
	if (hasName) {
		return `${details.firstName} ${details.lastName}`;
	}
	return hasOrg ? details.organisation : '';
};

const getRandomFormattedDate = (direction = 'future') => {
	const date = direction === 'future' ? faker.date.future() : faker.date.past();

	const displayedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});

	const [day, month, year] = displayedDate.split('/');
	const enteredFormat = [day, month, year];
	let displayedDateFormatted = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	const parts = displayedDateFormatted.split(' ');
	if (parts[1] && parts[1].length > 3) {
		parts[1] = parts[1].slice(0, 3);
		displayedDateFormatted = parts.join(' ');
	}

	return {
		displayedDate: displayedDateFormatted,
		enteredFormat: enteredFormat
	};
};

const getRandomQuarterDate = (direction = 'future') => {
	const year =
		direction === 'future' ? faker.date.future().getFullYear() : faker.date.past().getFullYear();
	const quarter = `Q${faker.datatype.number({ min: 1, max: 4 })}`;
	return `${quarter} ${year}`;
};

module.exports = {
	validateSummaryPage,
	validateProjectOverview,
	validateProjectInformation,
	updateProjectInformation,
	getShortMonthName,
	enquirerString,
	getRandomFormattedDate,
	getRandomQuarterDate,
	validatePreviewAndPublishInfo
};
