import { PDFExtract } from 'pdf.js-extract';

// create an array of HTML constants
export const HTML_CODES = {
	HTML_200_OK: 200,
	HTML_301_MOVED_PERMANENTLY: 301,
	HTML_404_NOT_FOUND: 404,
	HTML_429_TOO_MANY_REQUESTS: 429
};

/**
 *
 * @param {string} targetEnv
 * @returns {string}
 */
const getFoPrefix = (targetEnv) => {
	switch (targetEnv) {
		case 'DEV':
			return 'applications-service-dev';
		case 'TEST':
			return 'applications-service-test';
		case 'PROD':
			return 'national-infrastructure-consenting';
		default:
			return '';
	}
};

/**
 *
 * @type {{DEV: string, TEST: string, PROD: string}}
 */
const BLOB_STORE_PREFIXES = {
	DEV: 'pinsstdocsbodevukw001',
	TEST: 'pinsstdocsbotestukw001',
	PROD: 'pinsstdocsboprodukw001'
};

/**
 *
 * @type {{DEV: string, TEST: string, PROD: string}}
 */
const OLD_NI_PATH = {
	DEV: 'https://applications-service-dev.planninginspectorate.gov.uk/projects/',
	TEST: 'https://applications-service-test.planninginspectorate.gov.uk/projects/',
	PROD: 'https://infrastructure.planninginspectorate.gov.uk/wp-content/ipc/uploads/projects/'
};

const NI_OLD_LINK_START =
	'https://infrastructure.planninginspectorate.gov.uk/wp-content/ipc/uploads';
const DOCUMENT_LINK_PAGE_TMPL =
	'https://{fo_prefix}.planninginspectorate.gov.uk/projects/{caseReference}/documents';

/**
 * Exam Library Checker main fn
 * Checks the examination library PDF for a given case reference
 * and can verify that all document links are correctly redirected to the new CBOS Blob store.
 * It also checks that the documents can be accessed in the new location.
 *
 * @param {string} caseReference
 * @param {string} targetEnv
 * @param {boolean} doRedirectTest
 * @param {boolean} doBlobStoreTest
 */
export async function examLibraryChecker(
	caseReference,
	targetEnv,
	doRedirectTest,
	doBlobStoreTest
) {
	console.log(
		`-----------------------------------------\nStarting Exam Library Checker on case ${caseReference}`
	);
	console.log(`Target environment: ${targetEnv}`);
	console.log(`Do Redirect test: ${doRedirectTest}`);
	console.log(`Do Blob Store test: ${doBlobStoreTest}`);

	const examLibraryPdf = await fetchExamLibraryPdf(caseReference, targetEnv);
	let allNiLinks = await extractLinksFromPdf(examLibraryPdf);
	console.log(`Extracted ${allNiLinks.length} document links`);

	// example link :     'https://infrastructure.planninginspectorate.gov.uk/wp-content/ipc/uploads/projects/TR010031/TR010031-000621-A1B2CH%20-%20Reg%209%20Section%2056%20Notice.pdf';
	// blob changes to :   https://nsip-documents.planninginspectorate.gov.uk/published-documents/TR010031-000621-A1B2CH%20-%20Reg%209%20Section%2056%20Notice.pdf

	// check that all docs are permanently redirected
	if (doRedirectTest) {
		const totalDocsNotRedirected = await checkAllRedirectStatus(allNiLinks);
		if (totalDocsNotRedirected === 0) {
			console.log(`Checking Permanent Redirects - total failed=${totalDocsNotRedirected}`);
		}
	}

	// now check if docs can be returned when mapping to the new location (ie CBOS Blob store)
	if (doBlobStoreTest) {
		// @ts-ignore
		const OldNIPath = OLD_NI_PATH[targetEnv] + `${caseReference}/`;
		// @ts-ignore
		const blobPathDirect = `https://${BLOB_STORE_PREFIXES[targetEnv]}.blob.core.windows.net/published-documents/`;

		console.log(`Checking documents in Published Blob Store at: ${blobPathDirect}`);
		console.log(`Old NI Path: ${OldNIPath}`);
		// convert links from old NI path to new CBOS Blob store
		let remappedLinks = allNiLinks.map((link) => {
			return link.replace(OldNIPath, blobPathDirect);
		});

		await checkDocsInPublishedBlobStore(remappedLinks);
	}

	console.log('Examination library checker completed');
}

/**
 * Checks if array of doc URLs are correctly permanently redirected
 *
 * @param {string[]} allNiLinks
 * @returns {Promise<number>} // returns total docs NOT redirected
 */
async function checkAllRedirectStatus(allNiLinks) {
	/**
	 * A map of link to status, where true is a valid redirect
	 * @type {Object<string, boolean>}
	 */
	const linkStatus = {};
	for (const link of allNiLinks) {
		const response = await getDelayedResponse(link); // manual redirect to check for redirects
		switch (response.status) {
			case HTML_CODES.HTML_301_MOVED_PERMANENTLY:
				linkStatus[link] = true;
				console.log('Link is a redirect to nsip-documents:', response.headers.get('Location'));
				break;
			default:
				linkStatus[link] = false; // no redirect
				console.log(`Link ${link} is not redirected, error code:${response.status}`);
		}
	}

	// show summary
	console.log(
		Object.values(linkStatus).filter((status) => status === true).length,
		'links are redirects to nsip-documents'
	);
	console.log(
		Object.values(linkStatus).filter((status) => status === false).length,
		'links are not redirects to nsip-documents'
	);
	return Object.values(linkStatus).filter((status) => status === false).length;
}

/**
 * Checks if array of doc URLs are all in the Published CBOS Blob store
 *
 * @param {string[]} allLinks
 * @returns {Promise<number>} // returns total docs found
 */
async function checkDocsInPublishedBlobStore(allLinks) {
	/**
	 * A map of link to status, where true is a valid redirect
	 * @type {Object<string, boolean>}
	 */
	const linkStatus = {};
	let ctr = 0;
	for (const link of allLinks) {
		ctr++;
		// if the checker fails, timeout etc on too many docs/calls, then we can just rerun, skipping the first x:
		// if (ctr < 1400) {
		// 	continue;
		// }

		if (ctr % 100 === 0) {
			console.log(`Processing doc ${ctr} of ${allLinks.length}`);
		}
		const response = await getDelayedResponse(link); // manual redirect to check for redirects
		switch (response.status) {
			case HTML_CODES.HTML_200_OK:
				linkStatus[link] = true;
				// console.log(`. . . OK reading document link: ${link} `);
				break;
			default:
				linkStatus[link] = false; // no doc found
				console.log(`Error code:${response.status} reading document link: ${link} `);
				break;
		}
	}

	// show summary
	console.log(
		`Successes: ${
			Object.values(linkStatus).filter((status) => status === true).length
		} links are successfully found in blob store`
	);
	console.log(
		`Failures: ${
			Object.values(linkStatus).filter((status) => status === false).length
		} links are not found in blob store`
	);
	return Object.values(linkStatus).filter((status) => status === false).length;
}

/**
 *
 * @param {string} link
 * @returns {Promise<Response>}
 */
async function getDelayedResponse(link) {
	let responseCode = HTML_CODES.HTML_429_TOO_MANY_REQUESTS;
	let response;
	let bigFail = false;
	let waitTime = 1000;

	while (responseCode === HTML_CODES.HTML_429_TOO_MANY_REQUESTS && !bigFail) {
		try {
			response = await fetch(link, { redirect: 'manual' }); // manual redirect to check for redirects
			responseCode = response.status;
			if (responseCode === HTML_CODES.HTML_429_TOO_MANY_REQUESTS) {
				// get the retry after time from response if there is one
				if (response.headers) {
					waitTime = (Number(response.headers.get('Retry-After')) + 1) * 1000;
				} else {
					// no retry info
					waitTime = waitTime * 2;
					console.log('429 and no retry time given');
				}
				console.log(`Call failed, waiting ${waitTime / 1000} seconds before retry`);
				await sleep(waitTime);
			} else if (
				responseCode === HTML_CODES.HTML_200_OK ||
				responseCode === HTML_CODES.HTML_404_NOT_FOUND
			) {
				/* do nothing */
			} else {
				console.log(`Response status: ${responseCode}`);
			}
		} catch (err) {
			console.log(err);
			bigFail = true;
		}
	}
	// @ts-ignore
	return response;
}

/**
 * Fetch the examination library PDF for a given project reference
 *
 * @param {string} reference
 * @param {string} targetEnv
 * @returns {Promise<ArrayBuffer>} The PDF file as an ArrayBuffer
 */
async function fetchExamLibraryPdf(reference, targetEnv) {
	// first fetch the documents page to get the examination library link
	const documentsPageUrl = getDocumentLinkPage(reference, targetEnv);
	console.log(`Fetching documents page: ${documentsPageUrl}`);
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
			.filter((link) => link.startsWith(NI_OLD_LINK_START))
	); // filter links that start with the NI domain
}

/**
 * Returns a promise that waits for the given time before resolving.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * @param {string} caseReference
 * @param {string} targetEnv
 * @returns {string}
 */
function getDocumentLinkPage(caseReference, targetEnv) {
	// @ts-ignore
	return DOCUMENT_LINK_PAGE_TMPL.replace('{caseReference}', caseReference).replace(
		'{fo_prefix}',
		getFoPrefix(targetEnv)
	);
}
