import pdf from 'pdf-parse/lib/pdf-parse.js';

export async function examLibraryChecker() {
	const reference = 'TR010031';

	const documentsPageUrl = `https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/${reference}/documents`;
	const response = await fetch(documentsPageUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch documents page: ${response.statusText}`);
	}
	const html = await response.text();
	// example link:
	// <a class="govuk-link" href="https://nsip-documents.planninginspectorate.gov.uk/published-documents/TR010031-000602-Examination Library Template.pdf">View examination library (PDF, 550KB)</a>
	const headingIndex = html.indexOf('<h1 class="govuk-heading-xl">');
	const examLibraryIndexEnd = html.indexOf('View examination library');
	const examLibraryLinkText = html.slice(headingIndex, examLibraryIndexEnd);
	const examLibraryLink = examLibraryLinkText.match(/href="([^"]+)"/)[1];

	if (!examLibraryLink) {
		throw new Error('Examination library link not found');
	}
	const examLibraryResponse = await fetch(examLibraryLink);
	if (!examLibraryResponse.ok) {
		throw new Error(`Failed to fetch examination library: ${examLibraryResponse.statusText}`);
	}
	const examLibraryPdf = await examLibraryResponse.arrayBuffer();
	const pdfData = await pdf(examLibraryPdf);
	// const match = pdfData.text.matchAll(/infrastructure\.planninginspectorate\.gov\.uk/g);
	console.log(pdfData.text);
}
