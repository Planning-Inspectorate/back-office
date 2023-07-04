/**
 * Map a request body to a create request object, and sanitise the HTML
 *
 * @param {*} body
 * @param {number} caseId
 * @returns {import('@prisma/client').Prisma.ProjectUpdateCreateInput}
 */
export function projectUpdateCreateReq(body, caseId) {
	/** @type {import('@prisma/client').Prisma.ProjectUpdateCreateInput} */
	const createReq = {
		emailSubscribers: body.emailSubscribers,
		status: body.status,
		htmlContent: body.htmlContent,
		case: {
			connect: {
				id: caseId
			}
		}
	};
	if (body.authorId) {
		createReq.author = {
			connect: {
				id: parseInt(body.authorId)
			}
		};
	}
	if (body.title) {
		createReq.title = body.title;
	}
	if (body.htmlContentWelsh) {
		createReq.htmlContentWelsh = body.htmlContentWelsh;
	}

	return createReq;
}
