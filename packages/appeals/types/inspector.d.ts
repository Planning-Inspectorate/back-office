
type BookedAppealType<T extends AppealSummary> = T & {
	siteVisitDate: string;
	siteVisitTimeSlot: string;
	siteVisitType: SiteVisitType;
};

export interface UnbookedAppealSummary {
	appealAge: string;
	appealId: number;
	appealSite: {
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

export type BookedAppealSummary = BookedAppealType<UnbookedAppealSummary>;

export interface UnbookedAppeal extends UnbookedAppealSummary {
	appellantName: string;
	agentName?: string;
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
		canBeSeenFromPublicDescription: string;
		inspectorNeedsToEnterSite: boolean;
		inspectorNeedsToEnterSiteDescription: string;
		inspectorNeedsAccessToNeighboursLand: boolean;
		inspectorNeedsAccessToNeighboursLandDescription: string;
		healthAndSafetyIssues: boolean;
		healthAndSafetyIssuesDescription: string;
		appealsInImmediateArea: string;
	};
	appellantAnswers: {
		canBeSeenFromPublic: boolean;
		canBeSeenFromPublicDescription: string;
		appellantOwnsWholeSite: boolean;
		appellantOwnsWholeSiteDescription: string;
		healthAndSafetyIssues: boolean;
		healthAndSafetyIssuesDescription: string;
	};
  documents: AppealDocument[];
}

export type BookedAppeal = BookedAppealType<UnbookedAppeal>;
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
