import got from 'got';

export const csvController = async (req, res) => {
	const { caseId, repId } = req.params;

	console.log('Caseid: ', req.params);
	return got
		.stream(`http://localhost:3000/applications/${caseId}/representations/${repId}/csv`)
		.pipe(res);
};
