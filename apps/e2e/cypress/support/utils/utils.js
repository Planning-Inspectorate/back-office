// @ts-nocheck
const { CasePage } = require('../../page_objects/casePage');
const { CreateCasePage } = require('../../page_objects/createCasePage');
const { faker } = require('@faker-js/faker');
const { fullStringWithWhitespace } = require('./string');

const casePage = new CasePage();
const createCasePage = new CreateCasePage();

const caseIsWelsh = (projectInformation) => {
	return projectInformation.regions.includes('Wales');
};

const validateProjectOverview = (projectInformation, mandatoryOnly = false) => {
	if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
		casePage.validateSummaryItem('Reference number', Cypress.env('currentCreatedCase'));
		casePage.validateSummaryItem(
			'Organisation name',
			mandatoryOnly ? '' : projectInformation.orgName
		);
		casePage.validateSummaryItem(
			'Website',
			mandatoryOnly ? '' : projectInformation.applicantWebsite
		);
		casePage.validateSummaryItem(
			'Project email address',
			mandatoryOnly ? '' : projectInformation.projectEmail
		);
	} else {
		casePage.validateSummaryItem('Case reference', Cypress.env('currentCreatedCase'));
		casePage.validateSummaryItem(
			'Applicant information',
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

		casePage.clickLinkByText('Update project information');
	}
};

const validateProjectInformation = (projectInformation, mandatoryOnly = false, updated = false) => {
	validateProjectInformationSection(projectInformation);
	validateProjectDetailsSection(projectInformation, mandatoryOnly);
	validateApplicantInfoSection(projectInformation, mandatoryOnly, updated);
};

const validateProjectInformationSection = (projectInformation) => {
	if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
		casePage.checkProjectAnswer('Reference number', Cypress.env('currentCreatedCase'));
	} else {
		casePage.checkProjectAnswer('Case reference', Cypress.env('currentCreatedCase'));
	}

	casePage.checkProjectAnswer('Sector', projectInformation.sector);
	casePage.checkProjectAnswer('Subsector', projectInformation.subsector);
};

const validateProjectDetailsSection = (projectInformation, mandatoryOnly = false) => {
	casePage.checkProjectAnswer('Project description', projectInformation.projectDescription);
	casePage.checkProjectAnswer(
		fullStringWithWhitespace('Project email address'),
		mandatoryOnly ? '' : projectInformation.projectEmail
	);
	casePage.checkProjectAnswer('Project location', projectInformation.projectLocation);
	casePage.checkProjectAnswer(
		'Grid references',
		`${projectInformation.gridRefEasting} (Easting)${projectInformation.gridRefNorthing} (Northing)`
	);
	//casePage.checkProjectAnswer('Regions', projectInformation.regions.join(','));
	casePage.checkProjectAnswer(
		'Map zoom level',
		mandatoryOnly ? 'None' : projectInformation.zoomLevel
	);
};

const validateApplicantInfoSection = (
	projectInformation,
	mandatoryOnly = false,
	updated = false
) => {
	casePage.checkProjectAnswer(
		'Organisation name',
		mandatoryOnly ? '' : projectInformation.orgName,
		true
	);
	casePage.checkProjectAnswer(
		'Website',
		mandatoryOnly ? '' : projectInformation.applicantWebsite,
		true
	);
	casePage.checkProjectAnswer(
		fullStringWithWhitespace('Email address'),
		mandatoryOnly ? '' : projectInformation.applicantEmail,
		true
	);
	casePage.checkProjectAnswer(
		'Telephone number',
		mandatoryOnly ? '' : projectInformation.applicantPhoneNumber,
		true
	);
	casePage.checkProjectAnswer(
		'Contact name (Internal use only)',
		mandatoryOnly
			? ''
			: `${projectInformation.applicantFirstName}  ${projectInformation.applicantLastName}`,
		true
	);
	const address = updated
		? projectInformation.applicantFullAddress2
		: projectInformation.applicantFullAddress;
	casePage.checkProjectAnswer('Address (Internal use only)', mandatoryOnly ? '' : address, true);
};

const validatePreviewAndPublishInfo = (projectInformation) => {
	// P R O J E C T  I N F O R M A T I O N
	if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
		casePage.checkProjectAnswer('Reference number', Cypress.env('currentCreatedCase'));
	} else {
		casePage.checkProjectAnswer('case reference number', Cypress.env('currentCreatedCase'), true);
	}
	casePage.checkProjectAnswer('Sector', projectInformation.sector, true);
	casePage.checkProjectAnswer('Subsector', projectInformation.subsector, true);
	casePage.checkProjectAnswer('Project description', projectInformation.projectDescription, true);
	casePage.checkProjectAnswer('Project email address', projectInformation.projectEmail, true);
	casePage.checkProjectAnswer('Project location', projectInformation.projectLocation, true);
	casePage.checkProjectAnswer(
		'Grid references',
		`${projectInformation.gridRefEasting} (Easting)${projectInformation.gridRefNorthing} (Northing)`,
		true
	);
	if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
		casePage.checkProjectAnswer('Regions', projectInformation.regions.join(', '));
	} else {
		casePage.checkProjectAnswer('Region(s)', projectInformation.regions.join(', '), true);
	}

	casePage.checkProjectAnswer('Map zoom level', projectInformation.zoomLevel, true);

	// A P P L I C A T I O N  I N F O R M A T I O N
	casePage.checkProjectAnswer('Organisation name', projectInformation.orgName, true);
	casePage.checkProjectAnswer('Website', projectInformation.applicantWebsite, true);
	casePage.checkProjectAnswer(
		fullStringWithWhitespace('Email address'),
		projectInformation.applicantEmail,
		true
	);
};

const updateProjectNameInWelsh = (projectNameInWelsh) => {
	casePage.clickChangeLink('Project name in Welsh');
	casePage.fillTextArea(projectNameInWelsh);
	casePage.clickButtonByText('Save changes');
};

const updateProjectDescriptionInWelsh = (projectDescriptionInWelsh) => {
	casePage.clickChangeLink('Project description in Welsh');
	casePage.fillTextArea(projectDescriptionInWelsh);
	casePage.clickButtonByText('Save changes');
};

const updateProjectLocationInWelsh = (projectLocationInWelsh) => {
	casePage.clickChangeLink('Project location in Welsh');
	casePage.fillTextArea(projectLocationInWelsh);
	casePage.clickButtonByText('Save changes');
};

const updateProjectRegions = (projectRegions) => {
	if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
		casePage.clickChangeLink('Regions');
	} else {
		casePage.clickChangeLink('Region(s)');
	}
	casePage.clearAllCheckboxes();
	createCasePage.sections.regions.chooseRegions(projectRegions);
	casePage.clickButtonByText('Save changes');
};

const updateProjectInformation = (projectInformation) => {
	casePage.clickChangeLink('Project name');
	casePage.fillTextArea(projectInformation.projectName);
	casePage.clickButtonByText('Save changes');

	if (
		Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
		caseIsWelsh(projectInformation)
	) {
		updateProjectNameInWelsh(projectInformation.projectNameInWelsh);
	}

	casePage.clickChangeLink('Project description');
	casePage.fillTextArea(projectInformation.projectDescription);
	casePage.clickButtonByText('Save changes');

	if (
		Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
		caseIsWelsh(projectInformation)
	) {
		updateProjectDescriptionInWelsh(projectInformation.projectDescriptionInWelsh);
	}

	casePage.clickChangeLink('Project email address');
	casePage.fillInput(projectInformation.projectEmail);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Project location');
	casePage.fillTextArea(projectInformation.projectLocation);
	casePage.clickButtonByText('Save changes');

	if (
		Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
		caseIsWelsh(projectInformation)
	) {
		updateProjectLocationInWelsh(projectInformation.projectLocationInWelsh);
	}

	casePage.clickChangeLink('Grid references');
	casePage.fillInput(projectInformation.gridRefEasting);
	casePage.fillInput(projectInformation.gridRefNorthing, 1);
	casePage.clickButtonByText('Save changes');
	updateProjectRegions(projectInformation.regions);
	casePage.clickChangeLink('Map zoom level');
	createCasePage.sections.zoomLevel.chooseZoomLevel(projectInformation.zoomLevel);
	casePage.clickButtonByText('Save changes');

	// A P P L I C A T I O N  I N F O R M A T I O N
	casePage.clickChangeLink('Organisation name', true);
	casePage.fillInput(projectInformation.orgName);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Contact name (Internal use only)', true);
	casePage.fillInput(projectInformation.applicantFirstName);
	casePage.fillInput(projectInformation.applicantLastName, 1);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Address (Internal use only)', true);

	casePage.fillInput(projectInformation.postcode2);
	casePage.clickButtonByText('Find address');
	casePage.chooseSelectItemByIndex(1);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Website', true);
	casePage.fillInput(projectInformation.applicantWebsite);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink(fullStringWithWhitespace('Email address'), true);
	casePage.fillInput(projectInformation.applicantEmail);
	casePage.clickButtonByText('Save changes');

	casePage.clickChangeLink('Telephone number', true);
	casePage.fillInput(projectInformation.applicantPhoneNumber);
	casePage.clickButtonByText('Save changes');
};

const getShortFormattedDate = (date) => {
	const day = date.getDate();
	const month = date.toLocaleString('default', { month: 'short' }).substring(0, 3);
	const year = date.getFullYear();
	return `${day.toString().padStart(2, '0')} ${month} ${year}`;
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

const validateSectorSubsectorValues = (caseRef) => {
	if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
		casePage.validateSummaryItem('Reference number', caseRef);
	} else {
		casePage.clickLinkByText('Update project information');
		casePage.checkProjectAnswer('Case reference number', caseRef);
	}
	casePage.checkProjectAnswer('Sector', 'Training');
	casePage.checkProjectAnswer('Subsector', 'Training');
};

const validateWelshProjectInformation = (
	projectInformation,
	mandatoryOnly = false,
	updated = false
) => {
	validateProjectInformationSection(projectInformation);
	validateProjectDetailsSectionForWelshFields(projectInformation, mandatoryOnly);
	validateApplicantInfoSection(projectInformation, mandatoryOnly, updated);
};
const validateProjectDetailsSectionForWelshFields = (projectInformation, mandatoryOnly = false) => {
	casePage.checkProjectAnswer('Project description', projectInformation.projectDescription);
	casePage.checkProjectAnswer(
		fullStringWithWhitespace('Project email address'),
		mandatoryOnly ? '' : projectInformation.projectEmail
	);
	casePage.checkProjectAnswer('Project location', projectInformation.projectLocation);
	casePage.checkProjectAnswer(
		'Grid references',
		`${projectInformation.gridRefEasting} (Easting)${projectInformation.gridRefNorthing} (Northing)`
	);
	casePage.checkProjectAnswer('Regions', projectInformation.regions.sort().join(', '));
	casePage.checkProjectAnswer(
		'Map zoom level',
		mandatoryOnly ? 'None' : projectInformation.zoomLevel
	);
};

module.exports = {
	validateProjectOverview,
	validateProjectInformation,
	updateProjectNameInWelsh,
	updateProjectDescriptionInWelsh,
	updateProjectLocationInWelsh,
	updateProjectRegions,
	updateProjectInformation,
	getShortFormattedDate,
	enquirerString,
	getRandomFormattedDate,
	getRandomQuarterDate,
	validatePreviewAndPublishInfo,
	validateSectorSubsectorValues,
	validateWelshProjectInformation
};
