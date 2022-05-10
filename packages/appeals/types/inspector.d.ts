export interface UnbookedAppealSummary {
	appealId: number;
	address: {
		addressLine1: string;
		addressLine2?: string;
		town: string;
		county?: string;
		postCode: string;
	};
	appealType: AppealType;
	provisionalVisitType: SiteVisitType;
	reference: string;
	status: AppealStatus;
}

export interface BookedAppealSummary extends UnbookedAppealSummary {
	siteVisitDate: string;
	siteVisitTimeSlot: string;
	siteVisitType: SiteVisitType;
}

export interface UnbookedAppeal {
	status: AppealStatus;
	appealId: number;
	reference: string;
	provisionalSiteVisitType: SiteVisitType;
	appellantName: string;
	agentName?: string;
	appealSite: {
		addressLine1: string;
		addressLine2?: string;
		town: string;
		county?: string;
		postCode: string;
	};
	appealAge: string;
	email: string;
	appealReceivedDate: string;
	descriptionOfDevelopment: string;
	extraConditions: boolean;
	affectsListedBuilding: boolean;
	inGreenBelt: boolean;
	inOrNearConservationArea: boolean;
	emergingDevelopmentPlanOrNeighbourhoodPlan: boolean;
	emergingDevelopmentPlanOrNeighbourhoodPlanDescription?: string;
	lpaAnswers: {
		canBeSeenFromPublic: boolean;
		canBeSeenFromPublicDescription?: string;
		inspectorNeedsToEnterSite: boolean;
		inspectorNeedsToEnterSiteDescription?: string;
		inspectorNeedsAccessToNeighboursLand: boolean;
		inspectorNeedsAccessToNeighboursLandDescription?: string;
		healthAndSafetyIssues: boolean;
		healthAndSafetyIssuesDescription?: string;
		appealsInImmediateArea: boolean;
	};
	appellantAnswers: {
		canBeSeenFromPublic: boolean;
		canBeSeenFromPublicDescription: string;
		appellantOwnsWholeSite: boolean;
		appellantOwnsWholeSiteDescription: string;
		healthAndSafetyIssues: boolean;
		healthAndSafetyIssuesDescription: string;
	};
	Documents: AppealDocument[];
	availableForSiteVisitBooking: boolean;
	expectedSiteVisitBookingAvailableFrom?: string;
	canUploadFinalCommentsUntil?: string;
	canUploadStatementsUntil?: string;
}

export interface BookedAppeal extends UnbookedAppeal {
	bookedSiteVisit: {
		visitDate: string;
		visitTimeSlot: string;
		visitType: SiteVisitType;
	};
}

export interface AppealDocument {
	filename: string;
	type: string;
	url: string;
}

export type Appeal = UnbookedAppeal | BookedAppeal;
export type AppealSummary = UnbookedAppealSummary | BookedAppealSummary;

export type AppealOutcome = 'allowed' | 'dismissed' | 'split decision';
export type AppealType = 'HAS';
export type AppealStatus = 'decision due' | 'booked' | 'not yet booked';
export type SiteVisitType = 'accompanied' | 'unaccompanied' | 'access required';
