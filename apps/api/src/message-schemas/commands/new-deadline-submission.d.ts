export interface DeadlineSubmission {
	name: string;
	email: string;
	interestedParty?: boolean;
	interestedPartyReference?: string;
	deadline: string;
	submissionType: string;
	sensitiveData?: boolean;
	lateSubmission?: boolean;
	submissionId?: string;
	blobName: string;
}
