import { PDFExtract } from 'pdf.js-extract';

export async function examLibraryChecker() {
	const reference = 'TR010031';

	const examLibraryPdf = await fetchExamLibraryPdf(reference);
	const allNiLinks = await extractLinksFromPdf(examLibraryPdf);
	console.log(`Extracted ${allNiLinks.length} document links`);

	/**
	 * A map of link to status, where true is a valid redirect
	 * @type {Object<string, boolean>}
	 */
	const linkStatus = {};
	for (const link of allNiLinks) {
		const response = await fetch(link, { redirect: 'manual' }); // manual redirect to check for redirects
		if (response.status === 301) {
			linkStatus[link] = true;
			// console.log('Link is a redirect to nsip-documents:', response.headers.get('Location'));
		} else {
			linkStatus[link] = false; // no redirect
			// console.log(`Link ${link} is not redirected`);
		}
	}
	console.log(
		Object.values(linkStatus).filter((status) => status === true).length,
		'links are redirects to nsip-documents'
	);
	console.log(
		Object.values(linkStatus).filter((status) => status === false).length,
		'links are not redirects to nsip-documents'
	);
}

/**
 * Fetch the examination library PDF for a given project reference
 *
 * @param {string} reference
 * @returns {Promise<ArrayBuffer>} The PDF file as an ArrayBuffer
 */
async function fetchExamLibraryPdf(reference) {
	// first fetch the documents page to get the examination library link
	const documentsPageUrl = `https://national-infrastructure-consenting.planninginspectorate.gov.uk/projects/${reference}/documents`;
	const response = await fetch(documentsPageUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch documents page: ${response.statusText}`);
	}
	const html = await response.text();
	// crudely extract the link from the page
	// example link:
	// <a class="govuk-link" href="https://nsip-documents.planninginspectorate.gov.uk/published-documents/TR010031-000602-Examination Library Template.pdf">View examination library (PDF, 550KB)</a>
	const headingIndex = html.indexOf('<h1 class="govuk-heading-xl">');
	const examLibraryIndexEnd = html.indexOf('View examination library');
	const examLibraryLinkText = html.slice(headingIndex, examLibraryIndexEnd);
	const examLibraryLink = examLibraryLinkText.match(/href="([^"]+)"/)?.[1];

	if (!examLibraryLink) {
		throw new Error('Examination library link not found');
	}
	const examLibraryResponse = await fetch(examLibraryLink);
	if (!examLibraryResponse.ok) {
		throw new Error(`Failed to fetch examination library: ${examLibraryResponse.statusText}`);
	}
	return await examLibraryResponse.arrayBuffer();
}

/**
 * @param {ArrayBuffer} pdfBuffer
 * @returns {Promise<string[]>}
 */
async function extractLinksFromPdf(pdfBuffer) {
	const pdfExtract = new PDFExtract();
	// @ts-ignore - the types are correct in this function but not inferred by TypeScript because of the callback overload
	const pdfData = await pdfExtract.extractBuffer(pdfBuffer);
	// @ts-ignore
	return (
		// @ts-ignore
		pdfData.pages
			// @ts-ignore
			.map((p) => p.links) // get links from each page
			.flat() // flatten the array of arrays
			// @ts-ignore
			.filter((link) =>
				link.startsWith('https://infrastructure.planninginspectorate.gov.uk/wp-content/ipc/uploads')
			)
	); // filter links that start with the NI domain
}
