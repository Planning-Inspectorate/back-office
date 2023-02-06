/**
 * @param {any} request
 * @param {{ render: (arg0: string) => void; }} response
 */
export async function viewCaseUpdates(request, response) {
	response.render(`applications/case/project-updates`);
}
