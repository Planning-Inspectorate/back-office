// @ts-nocheck
import { SectionBase } from './sectionBase';

export class CheckYourAnswersSection extends SectionBase {
	elements = {
		answerCell: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).next(),
		changeLink: (question) =>
			cy.contains(this.selectors.tableCell, question, { matchCase: false }).nextUntil('a')
	};
	checkAnswer(question, answer) {
		this.elements.answerCell(question).then(($elem) => {
			cy.wrap($elem).should('have.text', answer);
		});
	}

	clickChangeLink(question) {
		this.elements.changeLink(question).click();
	}

	checkAllAnswers(projectInfo, mandatoryOnly = false) {
		// P R O J E C T  I N F O R M A T I O N
		this.checkAnswer('Project name', projectInfo.projectName);
		this.checkAnswer('Project description', projectInfo.projectDescription);
		this.checkAnswer('Sector', projectInfo.sector);
		this.checkAnswer('Subsector', projectInfo.subsector);
		this.checkAnswer('Project location', projectInfo.projectLocation);
		this.checkAnswer('Grid reference Easting', projectInfo.gridRefEasting);
		this.checkAnswer('Grid reference Northing', projectInfo.gridRefNorthing);
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			this.checkAnswer('Region', projectInfo.regions.sort().join(','));
		} else {
			this.checkAnswer('Region(s)', projectInfo.regions.sort().join(','));
		}
		this.checkAnswer('Map zoom level', mandatoryOnly ? 'None' : projectInfo.zoomLevel);

		if (!mandatoryOnly) {
			// A P P L I C A N T  I N F O R M A T I O N
			this.checkAnswer('Organisation name', projectInfo.orgName);
			this.checkAnswer('Contact name', projectInfo.applicantFullName);
			this.checkAnswer('Address', projectInfo.applicantFullAddress1);
			this.checkAnswer('Website', projectInfo.applicantWebsite);
			this.checkAnswer('Email address', projectInfo.applicantEmail);
			this.checkAnswer('Telephone number', projectInfo.applicantPhoneNumber);
			// K E Y  D A T E S
			this.checkAnswer('Anticipated submission date internal', projectInfo.internalDateFull);
			this.checkAnswer('Anticipated submission date published', projectInfo.publishedDate);
		}
	}

	checkAllAnswersForWelsh(projectInfo, mandatoryOnly = false) {
		// P R O J E C T  I N F O R M A T I O N
		this.checkAnswer('Project name', projectInfo.projectName);
		this.checkAnswer('Project description', projectInfo.projectDescription);
		this.checkAnswer('Sector', projectInfo.sector);
		this.checkAnswer('Subsector', projectInfo.subsector);
		this.checkAnswer('Project location', projectInfo.projectLocation);
		this.checkAnswer('Grid reference Easting', projectInfo.gridRefEasting);
		this.checkAnswer('Grid reference Northing', projectInfo.gridRefNorthing);
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			this.checkAnswer('Regions', 'Wales');
		} else {
			this.checkAnswer('Regions(s)', projectInfo.regions.sort().join(','));
		}
		this.checkAnswer('Map zoom level', mandatoryOnly ? 'None' : projectInfo.zoomLevel);

		if (!mandatoryOnly) {
			// A P P L I C A N T  I N F O R M A T I O N
			this.checkAnswer('Organisation name', projectInfo.orgName);
			this.checkAnswer('Contact name', projectInfo.applicantFullName);
			this.checkAnswer('Address', projectInfo.applicantFullAddress1);
			this.checkAnswer('Website', projectInfo.applicantWebsite);
			this.checkAnswer('Email address', projectInfo.applicantEmail);
			this.checkAnswer('Telephone number', projectInfo.applicantPhoneNumber);
			// K E Y  D A T E S
			this.checkAnswer('Anticipated submission date internal', projectInfo.internalDateFull);
			this.checkAnswer('Anticipated submission date published', projectInfo.publishedDate);
		}
	}

	validatePage() {
		this.validateSectionHeader('Check your answers before creating a new project');
	}
}
