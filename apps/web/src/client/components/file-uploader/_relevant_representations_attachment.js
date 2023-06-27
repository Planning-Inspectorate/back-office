/**
 *
 * @param {*} uploadInfo
 * @param {*} uploadForm
 * @return {Promise<void>}
 */
export const relevantRepresentationsAttachmentUpload = async (uploadInfo, uploadForm) => {
	if (window.location.href.includes('relevant-representations')) {
		const { caseId } = uploadForm.dataset;
		const urlParams = new URLSearchParams(window.location.search);
		const repId = urlParams.get('repId');

		const listOfDocuments = Array.isArray(uploadInfo.documents)
			? uploadInfo.documents
			: [uploadInfo.documents];

		const url = `/applications-service/case/${caseId}/relevant-representations/${repId}/api/upload`;
		for (const document of listOfDocuments) {
			await fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ documentId: document.GUID })
			});
		}
	}
};
